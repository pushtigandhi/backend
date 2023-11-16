import { Router } from 'express';
import Route from '@interfaces/route.interface';
import EventsController from '../../../controllers/events.controller';

export default class TasksRoute implements Route {
    public router: Router = Router();
    private eventsController = new EventsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.eventsController.getEvents);
        this.router.post('/', this.eventsController.addEvent);
    }
}
