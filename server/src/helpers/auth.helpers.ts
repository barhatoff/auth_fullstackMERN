import jwt from "jsonwebtoken";
import { constant } from "../constants";
import { NextFunction } from "express";

export const authHelpers = {
  jwtSign: (any_payload: any) => {
    const payload = { _id: any_payload._id };

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (accessSecret && refreshSecret) {
      const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: constant.TOKEN_ACCESS_LIFETIME,
      });
      const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: constant.TOKEN_REFRESH_LIFETIME,
      });

      return { accessToken, refreshToken };
    }
    return false;
  },
  jwtVerify: (
    token: string,
    next: NextFunction,
    type: "ACCESS" | "REFRESH"
  ): { valid: boolean; payload?: any } => {
    try {
      const secret =
        type === "ACCESS"
          ? process.env.JWT_ACCESS_SECRET
          : process.env.JWT_REFRESH_SECRET;
      if (secret) {
        const payload = jwt.verify(token, secret);
        return { valid: true, payload };
      }
      next({ code: 500, message: "jwt secret not defined" });
      return { valid: false };
    } catch (error) {
      next({ code: 401, message: "token not valid or exprired" });
      return { valid: false };
    }
  },
};
