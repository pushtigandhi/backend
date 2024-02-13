import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import ContactService from "../services/contacts.service";

export default class ContactsController {
    public contactService = new ContactService();

    public getContacts = async (req: Request, res: Response) => {
        try {
            const contacts = await this.contactService.getContacts();
            res.status(201).json({contacts});
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getContactById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const contact = await this.contactService.getContactById(id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.status(200).json({ contact });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addContact = async (req: Request, res: Response) => {
        let newContact = req.body;
        
        try {
            newContact = _.pick(newContact, ["name", "company", "phoneNumber", "notes"]);

            const missingFields = _.difference(["name"], Object.keys(newContact));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            } 

            const contact = await this.contactService.addContact(newContact);
            res.status(201).json({ contact });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deleteContact = async (req: Request, res: Response) => {
        const { id: contactId } = req.params;
        try {
            if (!isValidObjectId(contactId)) {
                return res.status(400).json({ error: 'Invalid contact ID' });
            }
            const contactId_ = new Types.ObjectId(contactId);

            const deletedContact = await this.contactService.deletedContact(contactId_);
            if (!deletedContact) {
                console.error(`Contact ${contactId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedContact });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editContact = async (req: Request, res: Response) => {
        const { id: contactId } = req.params;

        try {
            if (!isValidObjectId(contactId)) {
                return res.status(400).json({ error: 'Invalid contact ID' });
            }
            const contactId_ = new Types.ObjectId(contactId);

            const update = _.pick(req.body, [
                "name",
                "birthday",
                "phoneNumber",
                "notes"
            ]);

            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            const result = await this.contactService.editContact(
                contactId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    contact: result,
                });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    };
}