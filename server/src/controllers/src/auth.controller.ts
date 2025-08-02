import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../../database";
import { authHelpers } from "../../helpers/auth.helpers";
import { constant, enums } from "../../constants";
import { RefreshTokenModel } from "../../database/models/RefreshToken.model";
import { BlacklistToken } from "../../database/models/BlacklistToken.model";

export const authConroller = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, nickname, avatarUrl } = req.body;
      if (!email || !password)
        return next({ code: 400, message: "email and password required" });

      const isExist = await UserModel.findOne({ email });
      if (isExist)
        return next({
          code: 400,
          message: "user with this email already exist",
        });

      const hash = await bcrypt.hash(password, 12);
      const user = await UserModel.create({
        email,
        security: { password: hash },
        profile: { nickname, avatarUrl },
      });

      const tokens = authHelpers.jwtSign({ _id: user._id });
      if (tokens) {
        await RefreshTokenModel.create({
          userId: user._id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + constant.TOKEN_REFRESH_LIFETIME),
          ip: req.socket.remoteAddress,
        });
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.setHeader("Authorization", `Bearer ${tokens.accessToken}`);
        res.status(200).json({ message: "logged in" });
        return;
      }
      console.warn("????");

      return next({
        code: enums.RESPONSE_CODES.UNAUTHORIZED,
        message: "unknown error, try again",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email }).select(
        "+security.password"
      );
      if (user && user.security) {
        const isValid = await bcrypt.compare(password, user.security.password);
        if (isValid) {
          const tokens = authHelpers.jwtSign({
            _id: user._id,
          });
          if (tokens) {
            await RefreshTokenModel.create({
              userId: user._id,
              token: tokens.refreshToken,
              expiresAt: new Date(
                Date.now() + constant.TOKEN_REFRESH_LIFETIME * 1000
              ),
              ip: req.socket.remoteAddress,
            });
            res.cookie("refreshToken", tokens.refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.setHeader("Authorization", `Bearer ${tokens.accessToken}`);
            res.status(200).json({ message: "logged in" });
            return;
          }
        }
      }
      return next({
        code: enums.RESPONSE_CODES.UNAUTHORIZED,
        message: "email or password is not valid",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) return res.status(400).json({ message: "no token" });

      const bannedToken = await BlacklistToken.create({
        token: res.locals.access,
        expiresAt: new Date(Date.now() + constant.TOKEN_ACCESS_LIFETIME * 1000),
      });
      await RefreshTokenModel.deleteOne({ token });

      if (bannedToken) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
        return res.status(200).json({ message: "logged out" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return next({ code: enums.RESPONSE_CODES.FORBIDDEN });

      const verifyResult = authHelpers.jwtVerify(refreshToken, next, "REFRESH");
      if (verifyResult.valid) {
        const tokens = authHelpers.jwtSign(verifyResult.payload);
        if (tokens) {
          const result = await RefreshTokenModel.updateOne(
            {
              userId: verifyResult.payload._id,
            },
            {
              token: tokens.refreshToken,
              expiresAt: new Date(
                Date.now() + constant.TOKEN_REFRESH_LIFETIME * 1000
              ),
              ip: req.socket.remoteAddress,
            }
          );

          if (result.modifiedCount === 0)
            return next({
              code: enums.RESPONSE_CODES.FORBIDDEN,
              message: "token not found or expired",
            });
          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${tokens.accessToken}`);
          res.status(200).json({ message: "logged in" });
          return;
        }
      }
      return next({ code: enums.RESPONSE_CODES.FORBIDDEN });
    } catch (error) {
      next(error);
    }
  },
  whoim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  patch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      const { newEmail, newPassword, password } = req.body;

      if (!newEmail && !newPassword)
        return next({ code: 400, message: "new email and password is null" });
      if (user) {
        const isValid = await bcrypt.compare(password, user.security.password);
        if (isValid) {
          let result;
          if (newPassword) {
            const hash = await bcrypt.hash(newPassword, 12);
            result = await UserModel.updateOne(
              { _id: user._id },
              { security: { password: hash } }
            );
          }
          if (newEmail) {
            if (newEmail === user.email)
              return next({
                code: 400,
                message: "email should be different from the previous one",
              });
            result = await UserModel.updateOne(
              { _id: user._id },
              { email: newEmail }
            );
          }
          if (result && result?.modifiedCount > 0)
            return res.status(200).json({ message: "successful update" });
        }
      }
      return next({ code: 401 });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  patchProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, avatarUrl } = req.body;

      if (!nickname && !avatarUrl)
        return next({ code: 400, message: "bad request" });

      const result = await UserModel.updateOne(
        { _id: res.locals.user._id },
        {
          $set: {
            profile: {
              nickname,
              avatarUrl,
            },
          },
        }
      );
      if (result.modifiedCount > 0)
        return res.status(200).json({ message: "successful update" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
