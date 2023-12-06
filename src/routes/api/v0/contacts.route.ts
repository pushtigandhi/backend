import { Router } from 'express';
import Route from '@interfaces/route.interface';
import ContactsController from '../../../controllers/contacts.controller';

export default class ContactsRoute implements Route {
    public router: Router = Router();
    private contactController = new ContactsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.contactController.getContacts);
        this.router.get('/:id', this.contactController.getContactById);
        this.router.post('/', this.contactController.addContact);
        this.router.delete('/:id', this.contactController.deleteContact);
        this.router.patch('/:id', this.contactController.editContact);
    }
}
