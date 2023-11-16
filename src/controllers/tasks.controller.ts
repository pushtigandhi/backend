import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import _ from 'lodash';

import TaskService from "../services/tasks.service";

export default class ItemsController {
    public taskService = new TaskService();

    public getTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await this.taskService.getTasks();
            res.status(201).json({ tasks });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public addTask = async (req: Request, res: Response) => {
        let newTask = req.body;
        
        try {
            newTask = _.pick(newTask, ["title"]);

            const missingFields = _.difference(["title"], Object.keys(newTask));
            if (missingFields.length > 0) {
                return res.status(400).json({ error: 'Missing required fields', missingFields});
            } 

            const task = await this.taskService.addTask(newTask);
            res.status(201).json({ task });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }
}