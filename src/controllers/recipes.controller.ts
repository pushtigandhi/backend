import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import RecipeService from "../services/recipes.service";

export default class RecipeController {
    public recipeService = new RecipeService();
    
    public getRecipes = async (req: Request, res: Response) => {
        try {
            const recipes = await this.recipeService.getRecipes();
            res.status(201).json({ recipes });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getRecipeById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const recipe = await this.recipeService.getRecipeById(id);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.status(200).json({ recipe });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addRecipe = async (req: Request, res: Response) => {
        let newRecipe = req.body;

        try {
            newRecipe = _.pick(newRecipe, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newRecipe));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields });
            }

            const recipe = await this.recipeService.addRecipe(newRecipe);
            res.status(201).json({ recipe });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deleteRecipe = async (req: Request, res: Response) => {
        const { id: recipeId } = req.params;
        try {
            if (!isValidObjectId(recipeId)) {
                return res.status(400).json({ error: 'Invalid recipe ID' });
            }
            const recipeId_ = new Types.ObjectId(recipeId);

            const deletedRecipe = await this.recipeService.deleteRecipe(recipeId_);
            if (!deletedRecipe) {
                console.error(`Recipe ${recipeId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedRecipe });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editRecipe = async (req: Request, res: Response) => {
        const { id: recipeId } = req.params;

        try {
            if (!isValidObjectId(recipeId)) {
                return res.status(400).json({ error: 'Invalid recipe ID' });
            }
            const recipeId_ = new Types.ObjectId(recipeId);

            const update = _.pick(req.body, [
                "title",
                "description",
                "tags"
            ]);

            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            const result = await this.recipeService.editRecipe(
                recipeId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    recipe: result,
                });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    };
}