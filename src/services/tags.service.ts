import { Tag, ITag } from "../models/tag.model";
import { HydratedDocument, Types } from "mongoose";

export default class TagService {
    public tag_model = Tag;

    public async getTags(): Promise<Array<HydratedDocument<ITag>>> {
        let tags = this.tag_model.find();
        return tags;
    }

    public async getTagById(
        id: string
    ): Promise<HydratedDocument<ITag> | null> {
        const tag = await this.tag_model.findById(id);
        return tag as HydratedDocument<ITag> | null;
    }

    public async addTag(tag: ITag): Promise<HydratedDocument<ITag>> {
        //console.log("add tag service");
        const newTag = this.tag_model.create(tag);
        return newTag;
    }
    
    public async deletedTag(tagId: Types.ObjectId): Promise<ITag | null> {
        const deletedTag = await this.tag_model.findOneAndDelete({ _id: tagId });
        return deletedTag;
    }

    //delete later
    public async deletedTags(): Promise<ITag | null> {
        const deletedTag = await this.tag_model.findOneAndDelete({});
        return deletedTag;
    }


    public async editTag(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<ITag> | null> {
        const tag = await this.tag_model.findById(id);

        if (!tag) {
            return null;
        }

        try {
            const updatedTag = await this.tag_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedTag;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}