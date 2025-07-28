import { NextFunction, Request, Response } from "express";
import { AuditModel, UserModel } from "../../database";
import { helpers } from "../../helpers/helpers";
import { AuditHTTPLog } from "../../types";

export const rootController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find({});
      res.status(200).json(users);
      return;
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  printLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = "30", page = "1" } = req.query;

      const limitNum = Math.max(parseInt(limit as string, 10), 1);
      const pageNum = Math.max(parseInt(page as string, 10), 1);
      const skip = (pageNum - 1) * limitNum;

      const total = await AuditModel.countDocuments({});
      const logs: AuditHTTPLog[] = await AuditModel.find({})
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });
      console.log("________________________________________________");
      logs
        .reverse()
        .forEach((log: AuditHTTPLog) =>
          console.log(helpers.auditHTTPConsoleLog(log))
        );
      res.status(200).json({ total, message: "logs printed" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
