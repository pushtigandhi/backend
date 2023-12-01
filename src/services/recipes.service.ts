import { Recipe, IRecipe } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class RecipeService {
    public recipe_model = Recipe;
    
    public async getRecipes(): Promise<Array<HydratedDocument<IRecipe>>> {
        let recipes = this.recipe_model.find();
        return recipes;
    }

    public async getRecipeById(
        id: string
    ): Promise<HydratedDocument<IRecipe> | null> {
        const recipe = await this.recipe_model.findById(id);
        return recipe as HydratedDocument<IRecipe> | null;
    }

    public async addRecipe(recipe: IRecipe): Promise<HydratedDocument<IRecipe>> {
        const newRecipe = this.recipe_model.create(recipe);
        return newRecipe;
    }

    public async deleteRecipe(recipeId: Types.ObjectId): Promise<IRecipe | null> {
        const deletedRecipe = await this.recipe_model.findOneAndDelete({ _id: recipeId });
        return deletedRecipe;
    }

    public async editRecipe(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IRecipe> | null> {
        const recipe = await this.recipe_model.findById(id);

        if (!recipe) {
            return null;
        }

        try {
            const updatedRecipe = await this.recipe_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedRecipe;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}