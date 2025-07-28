import dotenv from "dotenv";

dotenv.config();

export const constant = {
  PORT: process.env.PORT ?? 3000,
  TOKEN_REFRESH_LIFETIME: 864000, // 10days
  TOKEN_ACCESS_LIFETIME: 900, // 15minutes
  MONGO_URL: process.env.DB_URL ?? "",
};

export const enums = {
  USER_ROLES: {
    ROOT: "ROOT",
    USER: "USER",
  },
  DATABASE_TABLES: {
    USER: "User",
    AUDIT: "Audit",
    REFRESH_TOKEN: "Token",
    BLACKLIST_TOKEN: "BlacklistToken",
  },
  RESPONSE_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,

    SERVER: 500,
  },
};
