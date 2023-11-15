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
    console.log("getting path...!");

        this.router.get('/', this.itemController.getItems);
        this.router.post('/', this.itemController.addItem);
    }
}
