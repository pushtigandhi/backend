import { Router } from 'express';
import Route from '@interfaces/route.interface';
import DirectoryController from '../../../controllers/directory.controller';
import { verifyAuth } from '../../../middlewares/auth.middleware';

export default class DirectoryRoute implements Route {
    public router: Router = Router();
    private directoryController = new DirectoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/:id', this.directoryController.getCategories); 
        this.router.post('/:id', this.directoryController.addCategory);
        this.router.delete('/:id', this.directoryController.deleteCategory);
        this.router.patch('/:id', this.directoryController.editCategory); 
    }
}