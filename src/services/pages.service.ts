import { Page, IPage } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class PageService {
    public page_model = Page;
    
    public async getPages(): Promise<Array<HydratedDocument<IPage>>> {
        let pages = this.page_model.find();
        return pages;
    }

    public async getPageById(
        id: string
    ): Promise<HydratedDocument<IPage> | null> {
        const page = await this.page_model.findById(id);
        return page as HydratedDocument<IPage> | null;
    }

    public async addPage(page: IPage): Promise<HydratedDocument<IPage>> {
        //console.log("add page service");
        const newPage = this.page_model.create(page);
        return newPage;
    }

    public async deletedPage(pageId: Types.ObjectId): Promise<IPage | null> {
        const deletedPage = await this.page_model.findOneAndDelete({ _id: pageId });
        return deletedPage;
    }

    public async editPage(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<IPage> | null> {
        const page = await this.page_model.findById(id);

        if (!page) {
            return null;
        }

        try {
            const updatedPage = await this.page_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedPage;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

}