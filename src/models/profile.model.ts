import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./users.model";
import Contact from "./contacts.model";
import { IImage } from "./image.model";


interface ISection {
  title: string;
  view: string;
}
const sectionSchema = new Schema<ISection>({
  title: {
    type: String,
    required: true, 
    //unique within profile. Handled frontend
  },
  view: {
    type: String,
  },
})

interface ICategory {
    title: string;
    color: string;
    sections: [ISection];
}
const categorySchema = new Schema<ICategory>({
    title: {
      type: String,
      required: true, 
      //unique within profile. Handled frontend
    },
    color: {
      type: String,
      default: "rgba(193, 192, 200, 1)",
    },
    sections: {
      type: [sectionSchema],
      default: [{title: "All", view: ""}],
    },
})

export interface IProfile {
  user: IUser;
  avatar: IImage;
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
      type: Schema.Types.ObjectId,
      ref: "Image",
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
        {'title': 'Backlog', 'sections': ["All"]},
        {'title': 'Cookbook', 'sections': ["All", "Recipes", "Resources"]},
        {'title': 'Journal', 'sections': ["All", "Resources"]},
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