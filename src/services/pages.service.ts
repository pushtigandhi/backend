import { Page, IPage } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class PageService {
    public page_model = Page;

    public async getPages(): Promise<Array<HydratedDocument<IPage>>> {
        const pages = this.page_model.find();
        return pages;
    }

    public async addPage(item: IPage): Promise<HydratedDocument<IPage>> {
        const page = this.page_model.create(item);
        return page;
    }
}