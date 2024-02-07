import Contact, { IContact } from "../models/contacts.model"
import { HydratedDocument, Types } from "mongoose";

export default class ContactService {
    public contact_model = Contact;

    public async getContacts(): Promise<Array<HydratedDocument<IContact>>> {
        let contacts = this.contact_model.find();
        return contacts;
    }

    public async getContactById(
        id: string
    ): Promise<HydratedDocument<IContact> | null> {
        const contact = await this.contact_model.findById(id);
        return contact as HydratedDocument<IContact> | null;
    }

    public async addContact(contact: IContact): Promise<HydratedDocument<IContact>> {
        //console.log("add contact service");
        const newContact = this.contact_model.create(contact);
        return newContact;
    }
    
    public async deletedContact(contactId: Types.ObjectId): Promise<IContact | null> {
        const deletedContact = await this.contact_model.findOneAndDelete({ _id: contactId });
        return deletedContact;
    }

    public async editContact(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IContact> | null> {
        const contact = await this.contact_model.findById(id);

        if (!contact) {
            return null;
        }

        try {
            const updatedContact = await this.contact_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedContact;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}