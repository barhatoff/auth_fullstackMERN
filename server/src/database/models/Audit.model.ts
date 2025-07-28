import mongoose from "mongoose";
import { enums } from "../../constants";

const auditSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    ip: { type: String, required: true },
    body: { type: Object, required: true },
  },
  { timestamps: true }
);

export const AuditModel = mongoose.model(
  enums.DATABASE_TABLES.AUDIT,
  auditSchema
);
