import { Item, IItem, Task, ITask, Event, IEvent,
    Page, IPage,Recipe, IRecipe } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class ItemService {
    public item_model = Item;
    public task_model = Task;
    public event_model = Event;
    public page_model = Page;
    public recipe_model = Recipe;

    public async getItems(
        itemType: string
    ): Promise<Array<HydratedDocument<IItem>>> {
        let items;
        switch (itemType) {
            case "task":
                items = this.task_model.find();
                break;
            case "event":
                items = this.event_model.find();
                break;
            case "page":
                items = this.page_model.find();
                break;
            case "recipe":
                items = this.recipe_model.find();
                break;
            default:
                items = this.item_model.find();
                break;
        }
        return items;
    }

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
            default:
                item = await this.item_model.findById(id);
                break;
        }
        return item as HydratedDocument<IItem> | null;
    }

    public async addItem(
        itemType: string,
        item: IItem
    ): Promise<HydratedDocument<IItem>> {
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