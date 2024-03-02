import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./users.model";
import Contact from "./contacts.model";

interface ICategory {
    title: string;
    sections: [string];
}
const categorySchema = new Schema<ICategory>({
    title: {
        type: String,
        required: true, 
        //unique within profile. Handled frontend
    },
    sections: {
      type: [String],
      default: ["All"],
    },
})

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
  items: [Schema.Types.ObjectId];
  directory: [ICategory];
  contactCard: Schema.Types.ObjectId;
  contacts: [Schema.Types.ObjectId];
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
    items: [{
      type: Schema.Types.ObjectId,
      ref: 'Item',
    }],
    directory: {
      type: [categorySchema],
      default: [
        {'title': 'Backlog', 'sections': ["All"]}
      ]
    },
    contactCard: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    }, 
    contacts: [{
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    }],
  },
  {
    timestamps: true,
  }
);

const Profile = model<IProfile>("Profile", profileSchema);

export default Profile;