import { Router } from 'express';
import Route from '@interfaces/route.interface';
import TaskController from '../../../controllers/tasks.controller';

export default class TasksRoute implements Route {
    public router: Router = Router();
    private taskController = new TaskController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.taskController.getTasks);
        this.router.get('/:id', this.taskController.getTaskById);
        this.router.post('/', this.taskController.addTask);
        this.router.delete('/:id', this.taskController.deleteTask);
        this.router.patch('/:id', this.taskController.editTask);

    }
}
