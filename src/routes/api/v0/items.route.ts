import { Router } from 'express';
import Route from '@interfaces/route.interface';
import ItemsController from '../../../controllers/items.controller';
import { verifyAuth } from '../../../middlewares/auth.middleware';

export default class ItemsRoute implements Route {
    public router: Router = Router();
    private itemController = new ItemsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', verifyAuth, this.itemController.getItems); 
        this.router.get('/:id', this.itemController.getItemById);
        this.router.post('/', verifyAuth, this.itemController.addItem);
        this.router.delete('/:id', this.itemController.deleteItem); //this.router.delete('/:id', verifyAuth, this.itemController.deleteItem);
        this.router.delete('/',  this.itemController.deleteItems); //delete later
        this.router.patch('/:id', this.itemController.editItem); //this.router.patch('/:id', verifyAuth, this.itemController.editObj);
    }
}
