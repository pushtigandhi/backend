import { Item, IItem } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class ItemService {
    public item_model = Item;

    public async getItems(): Promise<Array<HydratedDocument<IItem>>> {
        let items = this.item_model.find();
        return items;
    }

    public async addItem(item: IItem): Promise<HydratedDocument<IItem>> {
        //console.log("add item service");
        const newItem = this.item_model.create(item);
        return newItem;
    }
}