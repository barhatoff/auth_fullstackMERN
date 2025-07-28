import { NextFunction, Request, Response } from "express";
import { authHelpers } from "../../helpers/auth.helpers";
import { UserModel } from "../../database";
import { BlacklistToken } from "../../database/models/BlacklistToken.model";

export const authMiddleware = {
  checkIsUserAuthorizedByToken:
    (permissionLevel: "ROOT" | "USER" = "USER", select?: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let authHeder = req.headers.authorization;

        if (!authHeder || !authHeder.startsWith("Bearer "))
          return next({ code: 401, message: "token didnt provided" });

        const token = authHeder.split(" ")[1];

        const isInBlacklist = await BlacklistToken.findOne({ token });

        if (isInBlacklist)
          return next({
            code: 401,
            message: "access token not valid or exprired",
          });

        const jwtResult = authHelpers.jwtVerify(token, next, "ACCESS");
        if (jwtResult.valid) {
          const user = await UserModel.findOne({
            _id: jwtResult.payload._id,
          }).select(select ?? "");
          if (user) {
            if (user.role !== permissionLevel && user.role !== "ROOT")
              return next({ code: 403, message: "permission denied" });
            res.locals.user = user;
            res.locals.access = token;
            return next();
          }
        }
        return;
      } catch (error) {
        next(error);
      }
    },
};
