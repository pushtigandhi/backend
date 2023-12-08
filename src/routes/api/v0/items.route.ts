import { Router } from 'express';
import Route from '@interfaces/route.interface';
import ItemsController from '../../../controllers/items.controller';

export default class ItemsRoute implements Route {
    public router: Router = Router();
    private itemController = new ItemsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.itemController.getItems);
        this.router.get('/:id', this.itemController.getItemById);
        this.router.post('/', this.itemController.addItem);
        this.router.delete('/:id', this.itemController.deleteItem);
        this.router.patch('/:id', this.itemController.editObj);
    }
}
