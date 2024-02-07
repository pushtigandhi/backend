import { Types, Schema, model } from "mongoose";

export interface ITag {
    title: string;
    color: string;
    owner: Types.ObjectId;
}

const tagSchema = new Schema<ITag>({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "#FAFAFC"
    },
});

export const Tag = model<ITag>('Tag', tagSchema);