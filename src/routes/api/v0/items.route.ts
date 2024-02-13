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
        this.router.get('/', verifyAuth, this.itemController.getMyItems); 
        //this.router.get('/public', this.itemController.getItems);  --- for publically shared items
        this.router.get('/:id', this.itemController.getItemById);
        this.router.post('/', verifyAuth, this.itemController.addItem);
        //this.router.post('/verifyOwns', verifyAuth, this.itemController.ownsItem); -- for publically shared items
        this.router.delete('/:id', this.itemController.deleteItem); //this.router.delete('/:id', verifyAuth, this.itemController.deleteItem); ---for publically shared items
        this.router.patch('/:id', this.itemController.editItem); //this.router.patch('/:id', verifyAuth, this.itemController.editObj); ----for publically shared items
    }
}
