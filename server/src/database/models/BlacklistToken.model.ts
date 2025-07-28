import mongoose from "mongoose";
import { enums } from "../../constants";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true }
);

export const BlacklistToken = mongoose.model(
  enums.DATABASE_TABLES.BLACKLIST_TOKEN,
  blacklistTokenSchema
);
