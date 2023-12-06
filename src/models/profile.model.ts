import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./users.model";

export interface IProfile {
  user: IUser;
  avatar: Schema.Types.Mixed;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  emailInfo: {
    isVerified: boolean;
    email: string;
  }
}

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    avatar: {
      type: Schema.Types.Mixed,
    },
    displayName: {
      type: String,
    },
    emailInfo: {
      isVerified: Boolean,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = model<IProfile>("Profile", profileSchema);

export default Profile;