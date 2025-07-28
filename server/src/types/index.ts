// LOGGER
export type AuditHTTPLog = {
  time: string;
  user: string;
  role: string;
  method: string;
  url: string;
  ip: string;
  body: any;
};
export type AuditSocketLog = {
  event: string;
  user: string;
  roomID: string;
};

// DB INSTANCE
export type User = {
  email: string;
  role: string;
  profile?: { nickname: string; avatarUrl: string };
};
