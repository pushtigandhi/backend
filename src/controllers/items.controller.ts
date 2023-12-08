import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import ItemService from "../services/items.service";

export default class ItemsController {
    public itemService = new ItemService();

    public getItems = async (req: Request, res: Response) => {
        const { itemType } = req.query;
        try {
            const items = await this.itemService.getItems(itemType.toString());
            res.status(201).json({items});
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getItemById = async (req: Request, res: Response) => {
        const { itemType } = req.query;
        try {
            const id = req.params.id;
            const item = await this.itemService.getItemById(itemType.toString(), id);
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
        const { itemType } = req.query;

        let newItem = req.body;
        try {
            newItem = _.pick(newItem, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newItem));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            } 

            const item = await this.itemService.addItem(itemType.toString(), newItem);
            res.status(201).json({ item });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deleteItem = async (req: Request, res: Response) => {
        const { itemType } = req.query;

        const { id: itemId } = req.params;
        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

            const deletedItem = await this.itemService.deletedItem(itemType.toString(), itemId_);
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
    
    public editObj = async (req: Request, res: Response) => {
        const { itemType } = req.query;

        switch (itemType) {
            case "task":
                return this.editTask(req, res, itemType.toString());
            case "event":
                return this.editItem(req, res, itemType.toString());
            case "page":
                return this.editItem(req, res,itemType.toString());
            case "recipe":
                return this.editItem(req, res, itemType.toString());
            default:
                return this.editItem(req, res, itemType.toString());
        }
    }

    public editItem = async (req: Request, res: Response, itemType: string) => {
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
                itemType,
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

    public editTask = async (req: Request, res: Response, itemType: string) => {
        const { id: taskId } = req.params;
    
        try {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            const taskId_ = new Types.ObjectId(taskId);
    
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
                itemType,
                taskId_,
                update
            );
    
            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    task: result,
                });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    };

    public editEvent = async (req: Request, res: Response, itemType: string) => {
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

            const result = await this.itemService.editItem(
                itemType,
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

    public editPage = async (req: Request, res: Response, itemType: string) => {
        const { id: pageId } = req.params;

        try {
            if (!isValidObjectId(pageId)) {
                return res.status(400).json({ error: 'Invalid page ID' });
            }
            const pageId_ = new Types.ObjectId(pageId);

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
                itemType,
                pageId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    page: result,
                });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    };

    public editRecipe = async (req: Request, res: Response, itemType: string) => {
        const { id: recipeId } = req.params;

        try {
            if (!isValidObjectId(recipeId)) {
                return res.status(400).json({ error: 'Invalid recipe ID' });
            }
            const recipeId_ = new Types.ObjectId(recipeId);

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
                itemType,
                recipeId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    recipe: result,
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