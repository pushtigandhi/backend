import mongoose, { Schema, model } from "mongoose";

interface ISubModel{
    name: string;
}

const subModelSchema = new Schema<ISubModel>({
    name: {
        type: String,
        required: true
    },
})

export interface IModel {
    title: string;
    ingredients: [string];
    directions: [string];
    createdAt: Date;
    updatedAt: Date;
}

const recipeCardModel = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        index: "text"
        },
        ingredients: {
            type: [String],
            required: true,
        },
        directions: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Model = model<IModel>("Model", recipeCardModel);

export default Model;