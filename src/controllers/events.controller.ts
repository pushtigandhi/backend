import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import EventService from "../services/events.service";

export default class EventsController {
    public eventService = new EventService();

    public getEvents = async (req: Request, res: Response) => {
        try {
            const events = await this.eventService.getEvents();
            res.status(201).json({ events });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getEventById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json({ event });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addEvent = async (req: Request, res: Response) => {
        let newEvent = req.body;

        try {
            newEvent = _.pick(newEvent, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newEvent));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields });
            }

            const event = await this.eventService.addEvent(newEvent);
            res.status(201).json({ event });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deleteEvent = async (req: Request, res: Response) => {
        const { id: eventId } = req.params;
        try {
            if (!isValidObjectId(eventId)) {
                return res.status(400).json({ error: 'Invalid event ID' });
            }
            const eventId_ = new Types.ObjectId(eventId);

            const deletedEvent = await this.eventService.deleteEvent(eventId_);
            if (!deletedEvent) {
                console.error(`Event ${eventId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedEvent });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editEvent = async (req: Request, res: Response) => {
        const { id: eventId } = req.params;

        try {
            if (!isValidObjectId(eventId)) {
                return res.status(400).json({ error: 'Invalid event ID' });
            }
            const eventId_ = new Types.ObjectId(eventId);

            const update = _.pick(req.body, [
                "title",
                "description",
                "tags"
            ]);

            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            const result = await this.eventService.editEvent(
                eventId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    event: result,
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