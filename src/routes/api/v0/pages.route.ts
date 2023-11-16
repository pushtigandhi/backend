import { Router } from 'express';
import Route from '@interfaces/route.interface';
import PageController from '../../../controllers/pages.controller';

export default class TasksRoute implements Route {
    public router: Router = Router();
    private pageController = new PageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.pageController.getPages);
        this.router.post('/', this.pageController.addPage);
    }
}
