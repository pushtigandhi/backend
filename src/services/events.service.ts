import { Event, IEvent } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class TaskService {
    public event_model = Event;

    public async getEvents(): Promise<Array<HydratedDocument<IEvent>>> {
        const events = this.event_model.find();
        return events;
    }
    
    public async getEventById(
        id: string
    ): Promise<HydratedDocument<IEvent> | null> {
        const event = await this.event_model.findById(id);
        return event as HydratedDocument<IEvent> | null;
    }

    public async addEvent(item: IEvent): Promise<HydratedDocument<IEvent>> {
        const event = this.event_model.create(item);
        return event;
    }

    public async deleteEvent(
        eventId: Types.ObjectId
    ): Promise<HydratedDocument<IEvent> | null> {
        const deletedEvent = await this.event_model.findOneAndDelete({ _id: eventId });
        return deletedEvent;
    }

    public async editEvent(
        eventId: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IEvent> | null> {
        const event = await this.event_model.findById(eventId);

        if (!event) {
            return null;
        }

        try {
            const updatedEvent = await this.event_model.findOneAndUpdate(
                { _id: eventId },
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