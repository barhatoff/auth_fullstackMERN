import kleur from "kleur";
import { AuditHTTPLog, AuditSocketLog } from "../types";

export const helpers = {
  auditHTTPConsoleLog: (log: AuditHTTPLog) => {
    const logstring = `${kleur.bgGreen("[AUDIT]")} [${log.time}]: ${kleur.bgCyan(
      `usr:${log.user} role:${log.role} ip:${log.ip}`
    )} ${kleur.yellow(`${log.method} ${log.url}`)} ${JSON.stringify(log.body)}`;
    return logstring;
  },
  auditSOCKETLog: (log: AuditSocketLog) => {
    const logstring = `${kleur.bgGreen("[AUDIT]")} ${kleur.bgCyan("[WEBSOCKET]")} ROOM: ${kleur.dim(log.roomID)} usr: ${log.user} event: ${log.event}`;
    return logstring;
  },
  coloredLog: (log: string) => {
    let coloredString = kleur.bgGreen(log);
    return coloredString;
  },
};
