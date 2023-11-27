import { Item, IItem } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class ItemService {
    public item_model = Item;

    public async getItems(): Promise<Array<HydratedDocument<IItem>>> {
        let items = this.item_model.find();
        return items;
    }

    public async getItemById(
        id: string
    ): Promise<HydratedDocument<IItem> | null> {
        const item = await this.item_model.findById(id);
        return item as HydratedDocument<IItem> | null;
    }

    public async addItem(item: IItem): Promise<HydratedDocument<IItem>> {
        //console.log("add item service");
        const newItem = this.item_model.create(item);
        return newItem;
    }
    
    public async deletedItem(itemId: Types.ObjectId): Promise<IItem | null> {
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
}