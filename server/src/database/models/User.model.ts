import mongoose from "mongoose";
import { enums } from "../../constants";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    security: {
      password: { type: String, select: false, required: true },
      method: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
        select: false,
      },
      providerId: { type: String, select: false },
    },
    role: {
      type: String,
      enum: Object.values(enums.USER_ROLES),
      default: enums.USER_ROLES.USER,
    },
    profile: { nickname: { type: String }, avatarUrl: { type: String } },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model(enums.DATABASE_TABLES.USER, userSchema);
