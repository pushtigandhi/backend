import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
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

    public getItemById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const item = await this.itemService.getItemById(id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.status(200).json({ item });
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

    public deleteItem = async (req: Request, res: Response) => {
        const { id: itemId } = req.params;
        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

            const deletedItem = await this.itemService.deletedItem(itemId_);
            if (!deletedItem) {
                console.error(`Item ${itemId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editItem = async (req: Request, res: Response) => {
        const { id: itemId } = req.params;

        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

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

            const result = await this.itemService.editItem(
                itemId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    item: result,
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