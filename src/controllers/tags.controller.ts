import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import TagService from "../services/tags.service";


export default class TagsController {
    public tagService = new TagService();

    public getTags = async (req: Request, res: Response) => {
        try {
            const tags = await this.tagService.getTags();
            res.status(201).json({tags});
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getTagById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const tag = await this.tagService.getTagById(id);
            if (!tag) {
                return res.status(404).json({ error: 'Tag not found' });
            }
            res.status(200).json({ tag });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addTag = async (req: Request, res: Response) => {
        let newTag = req.body;
        
        try {
            newTag = _.pick(newTag, ["title", "color"]);

            const missingFields = _.difference(["title"], Object.keys(newTag));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            } 

            const tag = await this.tagService.addTag(newTag);
            res.status(201).json({ tag });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deleteTag = async (req: Request, res: Response) => {
        const { id: tagId } = req.params;
        try {
            if (!isValidObjectId(tagId)) {
                return res.status(400).json({ error: 'Invalid tag ID' });
            }
            const tagId_ = new Types.ObjectId(tagId);

            const deletedTag = await this.tagService.deletedTag(tagId_);
            if (!deletedTag) {
                console.error(`Tag ${tagId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedTag });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    //delete later
    public deleteTags = async (req: Request, res: Response) => {
        try {

            const deletedTag = await this.tagService.deletedTags();
            

            return res.status(200).json({ deletedTag });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editTag = async (req: Request, res: Response) => {
        const { id: tagId } = req.params;
        try {
            if (!isValidObjectId(tagId)) {
                return res.status(400).json({ error: 'Invalid tag ID' });
            }
            const tagId_ = new Types.ObjectId(tagId);

            const update = _.pick(req.body, [
                "color",
            ]);
            
            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            console.log(update);

            const result = await this.tagService.editTag(
                tagId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    tag: result,
                });
            }
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    };
}