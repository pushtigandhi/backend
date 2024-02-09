import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import ItemService, { IFilter } from "../services/items.service";
import { ItemType } from "../models/item.model";
import ProfileService from "../services/profile.service";

export default class ItemsController {
    public itemService = new ItemService();
    public profileService = new ProfileService();

    private getValidFilter = (req: Request) => {
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
                return {error: "Invalid date format" } as IFilter;
            }

        const validFilter = _.pick(filter, validFields) as IFilter;
        return validFilter;
    }

    public getMyItems = async (req: Request, res: Response) => {
        const { itemType } = req.query;
        
        const author = req.user; // get user
        if (!author) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const profile = await this.profileService.getProfileByUserId(
            author["_id"]
        );
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        await profile.populate("items");
        
        const filter = _.difference(_.keys(req.query), ["itemType"]);
        if (filter.length > 0 || itemType.toString().toUpperCase() !== ItemType.Item){
            const validFilter = this.getValidFilter(req);
            if (!!validFilter.error){
                return res.status(400).send(validFilter.error);
            }
            try {
                const items = await this.itemService.getItems(itemType.toString(), validFilter, profile.items);
                res.status(201).json({items});
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "server error"
                });
            }
        }
        else {
            res.status(201).json(profile.items);
        }
    }

    /*
     FOR PUBLIC POSTS 
      --- create new collection "Posts" that keeps publically shared items of all types 
      --- search and filter on posts with same conditions 
    */
    // public getItems = async (req: Request, res: Response) => {
    //     const { itemType } = req.query;
    //     try {
    //         const validFilter = this.getValidFilter(req);
    //         if (!!validFilter.error){
    //             return res.status(400).send(validFilter.error);
    //         }
    //         const items = await this.itemService.getItems(itemType.toString(), validFilter);
    //         res.status(201).json({items});
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: "server error"
    //         });
    //     }
    // }

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
            const item = await this.itemService.addItem(new Types.ObjectId(author["_id"]), itemType.toString(), newItem); //itemType is case sensitive: only first letter capitalized.
            
            const profile =  await this.profileService.editProfile(
                item.owner.toString(),
                { $addToSet: { items: item._id } }
            );

            if (!profile) {
                return res.status(500).json({
                  error: "server error",
                });
            }

            res.status(201).json({ profile, item });
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

            const profile =  await this.profileService.editProfile(
                deletedItem.owner.toString(),
                { $pull: { items: deletedItem["_id"] } }
            );

            if (!profile) {
                return res.status(500).json({
                  error: "server error",
                });
            }

            return res.status(200).json({ profile, deletedItem });
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
        
        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);

            const validFields = ["title", "category","section","icon",
            "favicon","tags","description","startDate",
            "endDate","duration","repeat","priority","notes"]; //GET() default active properties

            switch (itemType.toString().toUpperCase()) {
                case ItemType.Task:
                    let taskFields = ["subtasks"]; //GET() task active properties
                    validFields.push(...taskFields);
                case ItemType.Event:
                    let eventFields = ["contacts", "address", "location", "subtasks"]; //GET() event active properties
                    validFields.push(...eventFields);
                case ItemType.Page:
                    let pageFields = ["text"]; //GET() page active properties
                    validFields.push(...pageFields);
                case ItemType.Recipe:
                    let recipeFields = ["ingredients", "directions"]; //GET() recipe active properties
                    validFields.push(...recipeFields);
                default:
                    break;
            }

            let update = _.pick(req.body, validFields);
            
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

    public ownsItem = async (req: Request, res: Response) => {
        const { id: itemId } = req.params
        
        const author = req.user; // get user
        if (!author) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            if (!isValidObjectId(itemId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const itemId_ = new Types.ObjectId(itemId);
            const ownsItem = await this.itemService.ownsItem(new Types.ObjectId(author["_id"]), itemId_);
            if (ownsItem == null) {
                return res.status(404).json({ error: 'Item not found' });
            } else if (!ownsItem) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    }
}