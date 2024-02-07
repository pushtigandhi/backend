import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import ItemService, { IFilter } from "../services/items.service";
import { Tag } from "../models/tag.model";

export default class ItemsController {
    public itemService = new ItemService();

    public getItems = async (req: Request, res: Response) => {
        const { itemType } = req.query;

        const author = req.user; // get user
        if (!author) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const validFields = ["category", "section", "startlt", "startgt", "endlt", "endgt", "duration", "priority", "tags", "icon", "search"];
            
            const filter = req.query as any;

            try {
                if (!!filter.startlt) {
                    filter.startlt = new Date(parseInt(filter.startlt));
                }

                if (!!filter.startgt) {
                    filter.startgt = new Date(parseInt(filter.startgt));
                }
                if (!!filter.endlt) {
                    filter.endlt = new Date(parseInt(filter.endlt));
                }

                if (!!filter.endgt) {
                    filter.endgt = new Date(parseInt(filter.endgt));
                }
            } catch (e) {
                return res.status(400).send({message: "Invalid date format"});
            }

            const validFilter = _.pick(filter, validFields) as IFilter;

            // validFilter.author = author["_id"].toString();

            const items = await this.itemService.getItems(itemType.toString(), validFilter);
            res.status(201).json({items});
        } catch (error) {
            console.error(error);
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
        const author = req.user; // get user
        if (!author) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            newItem = _.pick(newItem, ["title", "description", "category", "section", "startDate", "endDate", "tags", "priority", "notes",
                            "repeat", "icon", "subtasks", "contacts", "location", "address", "text", "ingredients", "directions"]);

            const missingFields = _.difference(["title"], Object.keys(newItem));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            }
            const item = await this.itemService.addItem(new Types.ObjectId(author["_id"]), itemType.toString(), newItem);

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
        // const author = req.user; // get user
        // if (!author) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

            // const ownsItem = await this.itemService.ownsItem(new Types.ObjectId(author["_id"]), itemType.toString(), itemId_);
            // if (ownsItem == null) {
            //     return res.status(404).json({ error: 'Item not found' });
            // } else if (!ownsItem) {
            //     return res.status(403).json({ error: 'Forbidden' });
            // }

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
    
    public editItem = async (req: Request, res: Response) => {
        const { itemType } = req.query;
        const { id: itemId } = req.params;
        
        // const author = req.user; // get user
        // if (!author) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }

        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

            // const ownsItem = await this.itemService.ownsItem(new Types.ObjectId(author["_id"]), itemType.toString(), itemId_);
            // if (ownsItem == null) {
            //     return res.status(404).json({ error: 'Item not found' });
            // } else if (!ownsItem) {
            //     return res.status(403).json({ error: 'Forbidden' });
            // }

            const validFields =  [];

            switch (itemType) {
                case "task":
                    let taskFields = ["subtasks"]; //GET() task active properties
                    validFields.push(...taskFields);
                case "event":
                    let eventFields = ["contacts", "address", "location", "subtasks"]; //GET() event active properties
                    validFields.push(...eventFields);
                case "page":
                    let pageFields = ["text"]; //GET() page active properties
                    validFields.push(...pageFields);
                case "recipe":
                    let recipeFields = ["ingredients", "directions"]; //GET() recipe active properties
                    validFields.push(...recipeFields);
                default:
                    let defaultFields = ["title", "category","section","icon",
                        "favicon","tags","description","startDate",
                        "endDate","duration","repeat","priority","notes"]; //GET() default active properties
                    validFields.push(...defaultFields);
            }

            console.log("validFields: " + validFields);

            let update = _.pick(req.body, validFields);
            
            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            const result = await this.itemService.editItem(
                itemType.toString(),
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

    // public editTask = async (req: Request, res: Response, itemType: string) => {
    //     const { id: taskId } = req.params;
    
    //     try {
    //         if (!isValidObjectId(taskId)) {
    //             return res.status(400).json({ error: 'Invalid task ID' });
    //         }
    //         const taskId_ = new Types.ObjectId(taskId);
    
    //         let update = _.pick(req.body, [
    //             "title",
    //             "category",
    //             "section",
    //             "icon",
    //             "favicon",
    //             "tags",
    //             "description",
    //             "startDate",
    //             "endDate",
    //             "duration",
    //             "repeat",
    //             "priority",
    //             "notes",
    //             "subtasks"
    //         ]);
    
    //         if (Object.keys(update).length === 0) {
    //             return res.status(400).json({
    //                 error: "No fields were modifiable",
    //             });
    //         }
    
    //         const result = await this.itemService.editItem(
    //             itemType,
    //             taskId_,
    //             update
    //         );
    
    //         if (!result) {
    //             return res.status(500).json({
    //                 error: "server error",
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 message: "Successfully updated",
    //                 task: result,
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: "Server error",
    //         });
    //     }
    // };

    // public editEvent = async (req: Request, res: Response, itemType: string) => {
    //     const { id: eventId } = req.params;

    //     try {
    //         if (!isValidObjectId(eventId)) {
    //             return res.status(400).json({ error: 'Invalid event ID' });
    //         }
    //         const eventId_ = new Types.ObjectId(eventId);

    //         let update = _.pick(req.body, [
    //             "title",
    //             "category",
    //             "section",
    //             "icon",
    //             "favicon",
    //             "tags",
    //             "description",
    //             "startDate",
    //             "endDate",
    //             "duration",
    //             "repeat",
    //             "priority",
    //             "notes",
    //             "contacts",
    //             "address",
    //             "location",
    //             "subtasks"
    //         ]);

    //         if (Object.keys(update).length === 0) {
    //             return res.status(400).json({
    //                 error: "No fields were modifiable",
    //             });
    //         }

    //         const result = await this.itemService.editItem(
    //             itemType,
    //             eventId_,
    //             update
    //         );

    //         if (!result) {
    //             return res.status(500).json({
    //                 error: "server error",
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 message: "Successfully updated",
    //                 event: result,
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: "Server error",
    //         });
    //     }
    // };

    // public editPage = async (req: Request, res: Response, itemType: string) => {
    //     const { id: pageId } = req.params;

    //     try {
    //         if (!isValidObjectId(pageId)) {
    //             return res.status(400).json({ error: 'Invalid page ID' });
    //         }
    //         const pageId_ = new Types.ObjectId(pageId);

    //         let update = _.pick(req.body, [
    //             "title",
    //             "category",
    //             "section",
    //             "icon",
    //             "favicon",
    //             "tags",
    //             "description",
    //             "startDate",
    //             "endDate",
    //             "duration",
    //             "repeat",
    //             "priority",
    //             "notes",
    //             "text"
    //         ]);

    //         if (Object.keys(update).length === 0) {
    //             return res.status(400).json({
    //                 error: "No fields were modifiable",
    //             });
    //         }

    //         const result = await this.itemService.editItem(
    //             itemType,
    //             pageId_,
    //             update
    //         );

    //         if (!result) {
    //             return res.status(500).json({
    //                 error: "server error",
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 message: "Successfully updated",
    //                 page: result,
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: "Server error",
    //         });
    //     }
    // };

    // public editRecipe = async (req: Request, res: Response, itemType: string) => {
    //     const { id: recipeId } = req.params;

    //     try {
    //         if (!isValidObjectId(recipeId)) {
    //             return res.status(400).json({ error: 'Invalid recipe ID' });
    //         }
    //         const recipeId_ = new Types.ObjectId(recipeId);

    //         let update = _.pick(req.body, [
    //             "title",
    //             "category",
    //             "section",
    //             "icon",
    //             "favicon",
    //             "tags",
    //             "description",
    //             "startDate",
    //             "endDate",
    //             "duration",
    //             "repeat",
    //             "priority",
    //             "notes",
    //             "ingredients",
    //             "directions"
    //         ]);

    //         if (Object.keys(update).length === 0) {
    //             return res.status(400).json({
    //                 error: "No fields were modifiable",
    //             });
    //         }

    //         const result = await this.itemService.editItem(
    //             itemType,
    //             recipeId_,
    //             update
    //         );

    //         if (!result) {
    //             return res.status(500).json({
    //                 error: "server error",
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 message: "Successfully updated",
    //                 recipe: result,
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: "Server error",
    //         });
    //     }
    // };


    ///delete later 
    
    public deleteItems = async (req: Request, res: Response) => {
        const { itemType } = req.query;
        const deletedItem = await this.itemService.deletedItems();
    }

}