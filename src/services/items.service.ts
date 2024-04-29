import { Tag } from "../models/tag.model";
import { Item, IItem, Task, ITask, Event, IEvent, Scheduled, IScheduled,
    Page, IPage,Recipe, IRecipe, ItemType } from "../models/item.model"
import Profile, { IProfile } from "../models/profile.model";
import { IUser } from "../models/users.model";
import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

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
    author?: string;
    sortBy?: string;
    error?: string;
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
    //owner?: Types.ObjectId | string;
}

export default class ItemService {
    public item_model = Item;
    public task_model = Task;
    public event_model = Event;
    public page_model = Page;
    public recipe_model = Recipe;
    public profile_model = Profile;
    public scheduled_model = Scheduled;

    private getModel(itemType: string): Promise<Model<IItem>> {
        let model;
        switch (itemType.toUpperCase()) {
            case ItemType.Task:
                model = this.task_model;
                break;
            case ItemType.Event:
                model = this.event_model;
                break;
            case ItemType.Page:
                model = this.page_model;
                break;
            case ItemType.Recipe:
                model = this.recipe_model;
                break;
            case ItemType.Scheduled:
                model = this.scheduled_model;
                break;
            default:
                model = this.item_model;
                break;
        }
        return model;
    }

    public async getItems(
        itemType: string,
        filter: IFilter,
        myItems? : [Schema.Types.ObjectId]
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
        }

        let items;

        let query;
        
        //if (!!myItems) {
        query = (await myItems).filter(item => condition);
        if(itemType !== "item") {
            items = query.filter(item => item.itemType === itemType);
        }
        else {
            items = query;
        }
        // if(itemType !== "event") {
        //     items = query.populate("contacts");
        // }
        
        // }
        // else { --- for publically shared items
        //     query = (await this.getModel(itemType)).find(condition);
        //     items = await query.populate({path: "owner", select: "user" });
        // }

        // sort results if sortBy exists
        if (!!filter.sortBy) {
            items = items.sort(filter.sortBy === "startDate" ? { startDate: 1 } : { startDate : -1 });
            items = items.sort(filter.sortBy === "endDate" ? { endDate: 1 } : { endDate : -1 });
        }
        return items;
    }

    public async getItemById(
        id: string
    ): Promise<HydratedDocument<IItem>> {
        const item = this.item_model.findById(id);
        return item as HydratedDocument<any> | null;
    }

    public async addItem(
        author_id: Types.ObjectId,
        itemType: string,
        item: IItem
    ): Promise<HydratedDocument<IItem>> {
        const author_profile = await this.profile_model.findOne({ user: author_id });
        if (!author_profile) {
            throw new Error("Author profile not found");
        }
        item.owner = author_profile._id;

        const newItem = (await this.getModel(itemType)).create(item);

        return newItem;
    }
    
    public async deletedItem(
        itemId: Types.ObjectId
    ): Promise<IItem | null> {
        const deletedItem = await this.item_model.findOneAndDelete({ _id: itemId });
        return deletedItem;
    }

    public async editItem(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IItem> | null> {
        const item = await this.item_model.findById(id);

        if (!item) {
            return null;
        }
        try {
            const updatedItem = await this.item_model.findOneAndUpdate(
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

    public async ownsItem(
        author_id: Types.ObjectId,
        itemId: Types.ObjectId
    ): Promise<boolean | null> {
        const item = await this.item_model.findOne({
            _id: itemId,
        })

        if (!item) {
            return null;
        }

        // populate the owner field with Profile
        await Profile.populate(item, { path: 'owner', select: 'user' });
        // verify that the author_id matches the user id of the poster
        return ((((await item).owner as unknown as HydratedDocument<IProfile>).user) as unknown as HydratedDocument<IUser>)._id.equals(author_id);
    }

    ///delete later
    public async deletedItems(
    ): Promise<void> {
        await this.item_model.deleteMany({});
    }
}