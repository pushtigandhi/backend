import { Item, IItem, Task, ITask, Event, IEvent,
    Page, IPage,Recipe, IRecipe, ITag, Tag } from "../models/item.model"
import Profile from "../models/profile.model";
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";


export interface IFilter {
    search?: string;
    tags?: [string];
    category?: string;
    section?: string;
    startgt: Date;
    startlt: Date;
    endgt: Date;
    endlt: Date;
    priority?: string;
    durationlt: number;
    durationgt: number;
    poster?: string;
}

interface ICondition {
    $or?: [
        {notes: {$regex: string, $options: mongoose.RegexOptions}},
        {description: {$regex: string, $options: mongoose.RegexOptions}},
        {title: {$regex: string, $options: mongoose.RegexOptions}}
    ];
    tags? : { $in: [string] };
    category?: string;
    section?: string;
    startDate?: { $lt?: Date, $gt?: Date };
    endDate?: { $lt?: Date, $gt?: Date };
    priority?: string;
    duration?: { $lt?: number, $gt?: number };
    poster?: Types.ObjectId | string;
}

export default class ItemService {
    public item_model = Item;
    public task_model = Task;
    public event_model = Event;
    public page_model = Page;
    public recipe_model = Recipe;
    public tag_model = Tag;
    public profile_model = Profile;

    public async getItems(
        itemType: string,
        filter: IFilter
    ): Promise<Array<HydratedDocument<IItem>>> {
    let condition: ICondition = {};
    if (Object.keys(filter).length > 0) { // no filter otherwise

    if (!!filter.search){
        condition.$or = [
            {notes: {$regex: filter.search, $options: "i"}},
            {description: {$regex: filter.search, $options: "i"}},
            {title: {$regex: filter.search, $options: "i"}}
        ];
    }
    if (!!filter.tags && filter.tags.length > 0) {
        condition["tags"] = {$in: filter.tags};
    }
    if (!!filter.category) {
        condition["category"] = filter.category;
    }
    if (!!filter.section) {
        condition["section"] = filter.section;
    }
    if (!!filter.startlt || !!filter.startgt) {
        condition["startDate"] = {
        }; 

        if (!!filter.startlt) {
            condition["startDate"].$lt = filter.startlt;
        }
        if (!!filter.startgt) {
            condition["startDate"].$gt = filter.startgt;
        }
        console.log(condition["startDate"]);
    }
    if (!!filter.endlt || !!filter.endgt) {
        condition["endDate"] = {
        }; 

        if (!!filter.endlt) {
            condition["endDate"].$lt = filter.endlt;
        }
        if (!!filter.endgt) {
            condition["endDate"].$gt = filter.endgt;
        }
    }
    if (!!filter.durationlt || !!filter.durationgt) {
        condition["duration"] = {
        };
        
        if (!!filter.durationlt) {
            condition["duration"].$lt = filter.durationlt;
        }
        if (!!filter.durationgt) {
            condition["duration"].$gt = filter.durationgt;
        }
    }
    if (!!filter.priority) {
        condition["priority"] = filter.priority;
    }
    if (!!filter.poster) {
        condition["poster"] = filter.poster;
    }
    }

    let items;

    let query;

    switch (itemType) {
        case "task":
            query = this.task_model.find(condition);
            break;
        case "event":
            query = this.event_model.find(condition);
            break;
        case "page":
            query = this.page_model.find(condition);
            break;
        case "recipe":
            query = this.recipe_model.find(condition);
            break;
        case "tag":
            query = this.tag_model.find(condition);
            break;
        default:
            query = this.item_model.find(condition);
            break;
    }

    // if (itemType !== "tag")
    //     items = await query.populate("poster");
    // else
        items = query
    return items;
    }

    // public async getItems(
    //     itemType: string
    // ): Promise<Array<HydratedDocument<IItem>>> {
    //     let items;
    //     switch (itemType) {
    //         case "task":
    //             items = this.task_model.find();
    //             break;
    //         case "event":
    //             items = this.event_model.find();
    //             break;
    //         case "page":
    //             items = this.page_model.find();
    //             break;
    //         case "recipe":
    //             items = this.recipe_model.find();
    //             break;
    //         default:
    //             items = this.item_model.find();
    //             break;
    //     }
    //     return items;
    // }

    public async getItemById(
        itemType: string,
        id: string
    ): Promise<HydratedDocument<IItem> | null> {
        let item;
        switch (itemType) {
            case "task":
                item = await this.task_model.findById(id);
                break;
            case "event":
                item = await this.event_model.findById(id);
                break;
            case "page":
                item = await this.page_model.findById(id);
                break;
            case "recipe":
                item = await this.recipe_model.findById(id);
                break;
            case "tag":
                item = this.tag_model.findById(id);
                break;
            default:
                item = await this.item_model.findById(id);
                break;
        }
        return item as HydratedDocument<IItem> | null;
    }

    public async addItem(
        //author_id: Types.ObjectId,
        itemType: string,
        item: IItem
    ): Promise<HydratedDocument<IItem>> {
        // const author_profile = await this.profile_model.findOne({ user: author_id });
        // if (!author_profile) {
        //     throw new Error("Author profile not found");
        // }
        // item.poster = author_profile._id;

        let newItem;
        switch (itemType) {
            case "task":
                newItem = this.task_model.create(item);
                break;
            case "event":
                newItem = this.event_model.create(item);
                break;
            case "page":
                newItem = this.page_model.create(item);
                break;
            case "recipe":
                newItem = this.recipe_model.create(item);
                break;
            case "tag":
                newItem = this.tag_model.create(item);
                break;
            default:
                newItem = this.item_model.create(item);
                break;
        }
        return newItem;
    }
    
    public async deletedItem(
        itemType: string,
        itemId: Types.ObjectId
    ): Promise<IItem | null> {
        let deletedItem;
        switch (itemType) {
            case "task":
                deletedItem = this.task_model.findOneAndDelete({ _id: itemId });
                break;
            case "event":
                deletedItem = this.event_model.findOneAndDelete({ _id: itemId });
                break;
            case "page":
                deletedItem = this.page_model.findOneAndDelete({ _id: itemId });
                break;
            case "recipe":
                deletedItem = this.recipe_model.findOneAndDelete({ _id: itemId });
                break;
            case "tag":
                deletedItem = this.tag_model.findOneAndDelete({ _id: itemId });
                break;
            default:
                deletedItem = this.item_model.findOneAndDelete({ _id: itemId });
        }
        return deletedItem;
    }

    public async editItem(
        itemType: string,
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IItem> | null> {
        let model;
        switch (itemType) {
            case "task":
                model = this.task_model;
                break;
            case "event":
                model = this.event_model;
                break;
            case "page":
                model = this.page_model;
                break;
            case "recipe":
                model = this.recipe_model;
                break;
            case "tag":
                model = this.tag_model;
                break;
            default:
                model = this.item_model;
        }

        const item = await model.findById(id);

        if (!item) {
            return null;
        }

        try {
            const updatedItem = await model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedItem;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}