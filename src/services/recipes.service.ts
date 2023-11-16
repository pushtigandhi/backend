import { Recipe, IRecipe } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class RecipeService {
    public recipe_model = Recipe;

    public async getRecipes(): Promise<Array<HydratedDocument<IRecipe>>> {
        const recipes = this.recipe_model.find();
        return recipes;
    }

    public async addRecipe(item: IRecipe): Promise<HydratedDocument<IRecipe>> {
        const recipe = this.recipe_model.create(item);
        return recipe;
    }
}