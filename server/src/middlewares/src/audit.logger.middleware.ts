import { NextFunction, Response, Request } from "express";
import { helpers } from "../../helpers/helpers";
import { AuditHTTPLog, User } from "../../types";
import { AuditModel } from "../../database";

export const auditLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user
    ? res.locals.user
    : { email: "Not authorized", role: "-" };

  const date = new Date();
  const blacklistURL = ["/auth/login", "/auth/register"];
  const http_log: AuditHTTPLog = {
    time: date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }),
    user: user.email,
    role: user.role,
    method: req.method,
    url: req.originalUrl,
    ip: req.socket.remoteAddress ?? "-",
    body: blacklistURL.includes(req.originalUrl)
      ? { email: req.body.email }
      : req.method === "GET"
        ? "-"
        : (req.body ?? {}),
  };

  await AuditModel.create(http_log);
  console.log(helpers.auditHTTPConsoleLog(http_log));
  next();
};
