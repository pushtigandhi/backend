import { Router } from 'express';
import Route from '@interfaces/route.interface';
import PageController from '../../../controllers/pages.controller';

export default class PageRoute implements Route {
    public router: Router = Router();
    private pageController = new PageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.pageController.getPages);
        this.router.get('/:id', this.pageController.getPageById);
        this.router.post('/', this.pageController.addPage);
        this.router.delete('/:id', this.pageController.deletePage);
        this.router.patch('/:id', this.pageController.editPage);
    }
}
