import { Router } from 'express';
import Route from '@interfaces/route.interface';
import RecipeController from '../../../controllers/recipes.controller';

export default class RecipeRoute implements Route {
    public router: Router = Router();
    private recipeController = new RecipeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.recipeController.getRecipes);
        this.router.post('/', this.recipeController.addRecipe);
    }
}
