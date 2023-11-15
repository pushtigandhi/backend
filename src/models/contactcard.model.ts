import mongoose, { Schema, model } from "mongoose";

// interface ISubModel{
//     name: string;
// }

// const subModelSchema = new Schema<ISubModel>({
//     name: {
//         type: String,
//         required: true
//     },
// })

export interface IContactCard {
    title: string;
    birthday: Date;
    phoneNumber: Number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactCardSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        index: "text"
        },
        birthday: {
            type: Date,
        },
        phoneNumber: {
            type: Number,
        },
        notes: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const ContactCard = model<IContactCard>("contactCardSchema", contactCardSchema);

export default ContactCard;