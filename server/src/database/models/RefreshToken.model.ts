import mongoose from "mongoose";
import { enums } from "../../constants";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    ip: { type: String },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true }
);

export const RefreshTokenModel = mongoose.model(
  enums.DATABASE_TABLES.REFRESH_TOKEN,
  refreshTokenSchema
);
