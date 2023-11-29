import { Event, IEvent } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class TaskService {
    public event_model = Event;

    public async getEvents(): Promise<Array<HydratedDocument<IEvent>>> {
        let events = this.event_model.find();
        return events;
    }

    public async getEventById(
        id: string
    ): Promise<HydratedDocument<IEvent> | null> {
        const event = await this.event_model.findById(id);
        return event as HydratedDocument<IEvent> | null;
    }

    public async addEvent(event: IEvent): Promise<HydratedDocument<IEvent>> {
        //console.log("add event service");
        const newEvent = this.event_model.create(event);
        return newEvent;
    }

    public async deleteEvent(eventId: Types.ObjectId): Promise<IEvent | null> {
        const deletedEvent = await this.event_model.findOneAndDelete({ _id: eventId });
        return deletedEvent;
    }

    public async editEvent(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IEvent> | null> {
        const event = await this.event_model.findById(id);

        if (!event) {
            return null;
        }

        try {
            const updatedEvent = await this.event_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedEvent;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}