import { Router } from 'express'
import UsersController from '../../../controllers/users.controller';
import Route from '../../../interfaces/route.interface';
import { verifyAuth } from '../../../middlewares/auth.middleware';
export default class UsersRoute implements Route {
    public router: Router = Router();
    private userController = new UsersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.userController.getUsers);
        this.router.get('/me', verifyAuth, this.userController.getMe);
        this.router.get('/handle', verifyAuth, this.userController.getUserByHandle);
        //delete the below
        this.router.post('/', this.userController.createTestUser);
        this.router.post('/profile', this.userController.createTestProfile);
        this.router.delete('/', this.userController.clearUsers);
    }
}