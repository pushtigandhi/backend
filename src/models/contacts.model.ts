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

interface IAddress {
    street: string,
    city: string,
    state: string,
    postalCode: string,
}

const addressSchema = new mongoose.Schema({
  street: {
      type: String,
      required: true,
    },
  city: {
      type: String,
      required: true,
    },
  state: {
      type: String,
      required: true,
    },
  postalCode: {
      type: String,
      required: true,
    }
});

export interface IContact {
    name: string;
    handle?: string;
    company?: string;
    birthday?: Date;
    phoneNumber?: Number;
    notes?: string;
    address?: IAddress;
    createdAt?: Date;
    updatedAt?: Date;
}

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        handle: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        birthday: {
            type: Date,
        },
        phoneNumber: {
            type: Number,
        },
        notes: {
            type: String,
        },
        address: {
            type: addressSchema,
        }
    },
    {
        timestamps: true,
    }
);

const Contact = model<IContact>("Contact", contactSchema);

export default Contact;