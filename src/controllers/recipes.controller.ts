import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
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

    public addRecipe = async (req: Request, res: Response) => {
        let newRecipe = req.body;
        
        try {
            newRecipe = _.pick(newRecipe, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newRecipe));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
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
}