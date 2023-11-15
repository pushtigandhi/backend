import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import _ from 'lodash';

import ItemService from "../services/items.service";

export default class ItemsController {
    public itemService = new ItemService();

    public getItems = async (req: Request, res: Response) => {
        try {
            const items = await this.itemService.getItems();
            res.status(201).json({items});
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addItem = async (req: Request, res: Response) => {
        let newItem = req.body;
        
        try {
            newItem = _.pick(newItem, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newItem));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            } 

            const item = await this.itemService.addItem(newItem);
            res.status(201).json({ item });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }
}