import { Router } from 'express';
import Route from '@interfaces/route.interface';
import EventsController from '../../../controllers/events.controller';

export default class EventsRoute implements Route {
    public router: Router = Router();
    private eventController = new EventsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.eventController.getEvents);
        this.router.get('/:id', this.eventController.getEventById);
        this.router.post('/', this.eventController.addEvent);
        this.router.delete('/:id', this.eventController.deleteEvent);
        this.router.patch('/:id', this.eventController.editEvent);
    }
}
