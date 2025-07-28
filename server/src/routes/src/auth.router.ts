import { Router } from "express";
import { authConroller } from "../../controllers/src/auth.controller";
import {
  auditLogger,
  authMiddleware,
  checkValidityMiddleware,
} from "../../middlewares";
import { joiSchemas } from "../../joi.schemas";

const authRouter = Router();

authRouter.get(
  "/",
  authMiddleware.checkIsUserAuthorizedByToken(),
  authConroller.whoim
);
authRouter.post("/login", auditLogger, authConroller.login);
authRouter.get("/refresh", authConroller.refresh);
authRouter.post(
  "/register",
  checkValidityMiddleware(joiSchemas.user),
  auditLogger,
  authConroller.register
);
authRouter.get(
  "/logout",
  authMiddleware.checkIsUserAuthorizedByToken(),
  auditLogger,
  authConroller.logout
);
authRouter.patch(
  "/",
  authMiddleware.checkIsUserAuthorizedByToken("USER", "+security.password"),
  checkValidityMiddleware(joiSchemas.userPatch),
  auditLogger,
  authConroller.patch
);
authRouter.patch(
  "/profile",
  authMiddleware.checkIsUserAuthorizedByToken(),
  checkValidityMiddleware(joiSchemas.userProfile),
  auditLogger,
  authConroller.patchProfile
);

export { authRouter };
