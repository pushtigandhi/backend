import { Event, IEvent } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class TaskService {
    public event_model = Event;

    public async getEvents(): Promise<Array<HydratedDocument<IEvent>>> {
        const events = this.event_model.find();
        return events;
    }

    public async addEvent(item: IEvent): Promise<HydratedDocument<IEvent>> {
        const event = this.event_model.create(item);
        return event;
    }
}