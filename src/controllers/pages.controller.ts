import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import PageService from "../services/pages.service";

export default class PageController {
    public pageService = new PageService();
    // Updated controllerFunctions
    public getPages = async (req: Request, res: Response) => {
        try {
            const pages = await this.pageService.getPages();
            res.status(201).json({ pages });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public getPageById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const page = await this.pageService.getPageById(id);
            if (!page) {
                return res.status(404).json({ error: 'Page not found' });
            }
            res.status(200).json({ page });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addPage = async (req: Request, res: Response) => {
        let newPage = req.body;

        try {
            newPage = _.pick(newPage, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newPage));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields });
            }

            const page = await this.pageService.addPage(newPage);
            res.status(201).json({ page });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public deletePage = async (req: Request, res: Response) => {
        const { id: pageId } = req.params;
        try {
            if (!isValidObjectId(pageId)) {
                return res.status(400).json({ error: 'Invalid page ID' });
            }
            const pageId_ = new Types.ObjectId(pageId);

            const deletedPage = await this.pageService.deletedPage(pageId_);
            if (!deletedPage) {
                console.error(`Page ${pageId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }

            return res.status(200).json({ deletedPage });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editPage = async (req: Request, res: Response) => {
        const { id: pageId } = req.params;

        try {
            if (!isValidObjectId(pageId)) {
                return res.status(400).json({ error: 'Invalid page ID' });
            }
            const pageId_ = new Types.ObjectId(pageId);

            const update = _.pick(req.body, [
                "title",
                "description",
                "tags"
            ]);

            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "No fields were modifiable",
                });
            }

            const result = await this.pageService.editPage(
                pageId_,
                update
            );

            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    page: result,
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