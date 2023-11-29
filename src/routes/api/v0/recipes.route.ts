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
        this.router.get('/:id', this.recipeController.getRecipeById);
        this.router.post('/', this.recipeController.addRecipe);
        this.router.delete('/:id', this.recipeController.deleteRecipe);
        this.router.patch('/:id', this.recipeController.editRecipe);
    }
}
