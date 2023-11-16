import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import _ from 'lodash';

import PageService from "../services/pages.service";

export default class PageController {
    public pageService = new PageService();

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

    public addPage = async (req: Request, res: Response) => {
        let newPage = req.body;
        
        try {
            newPage = _.pick(newPage, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newPage));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
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
}