import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INote> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
