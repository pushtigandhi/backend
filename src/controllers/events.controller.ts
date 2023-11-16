import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import _ from 'lodash';

import EventService from "../services/events.service";

export default class ItemsController {
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

    public addEvent = async (req: Request, res: Response) => {
        let newEvent = req.body;
        
        try {
            newEvent = _.pick(newEvent, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newEvent));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
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
}