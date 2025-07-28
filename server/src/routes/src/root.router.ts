import { Router } from "express";
import { auditLogger, authMiddleware } from "../../middlewares";
import { rootController } from "../../controllers";

const rootRouter = Router();

rootRouter.get(
  "/users",
  authMiddleware.checkIsUserAuthorizedByToken("ROOT"),
  auditLogger,
  rootController.getAllUsers
);
rootRouter.get(
  "/logs",
  authMiddleware.checkIsUserAuthorizedByToken("ROOT"),
  auditLogger,
  rootController.printLogs
);

export { rootRouter };
