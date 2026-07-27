import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShare extends Document {
  _id: mongoose.Types.ObjectId;
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  isPasswordProtected: boolean;
  passwordHash?: string;
  isOneTime: boolean;
  isUsed: boolean;
  expiresAt?: Date;
  isRevoked: boolean;
  viewCount: number;
  createdAt: Date;
}

const ShareSchema: Schema<IShare> = new Schema(
  {
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    isPasswordProtected: { type: Boolean, default: false },
    passwordHash: { type: String },
    isOneTime: { type: Boolean, default: false },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date },
    isRevoked: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Share: Model<IShare> = mongoose.models.Share || mongoose.model<IShare>("Share", ShareSchema);

export default Share;
