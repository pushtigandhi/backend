import { Router } from 'express';
import Route from '@interfaces/route.interface';
import TagsController from '../../../controllers/tags.controller';
import { verifyAuth } from '../../../middlewares/auth.middleware';

export default class TagsRoute implements Route {
    public router: Router = Router();
    private tagController = new TagsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', verifyAuth, this.tagController.getTags);
        this.router.get('/:id', this.tagController.getTagById);
        this.router.post('/', verifyAuth, this.tagController.addTag);
        this.router.delete('/:id', this.tagController.deleteTag);
        this.router.delete('/', this.tagController.deleteTags);
        this.router.patch('/:id', this.tagController.editTag);
    }
}
