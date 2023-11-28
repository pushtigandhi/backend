import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import _ from 'lodash';

import TaskService from "../services/tasks.service";

export default class TaskController {
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

    public getTaskById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const task = await this.taskService.getTaskById(id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.status(200).json({ task });
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

    public deleteTask = async (req: Request, res: Response) => {
        const { id: taskId } = req.params;

        try {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid item ID' });
            }
            const taskId_ = new Types.ObjectId(taskId);

            const deletedTask = await this.taskService.deletedTask(taskId_);
            if (!deletedTask) {
                console.error(`Item ${taskId} not found during deletion`);
                return res.status(500).json({ error: 'Server error' });
            }
            return res.status(200).json({ deletedTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "server error"
            });
        }
    }

    public editTask = async (req: Request, res: Response) => {
        const { id: taskId } = req.params;
    
        try {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID' });
            }
            const taskId_ = new Types.ObjectId(taskId);
    
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
    
            const result = await this.taskService.editTask(
                taskId_,
                update
            );
    
            if (!result) {
                return res.status(500).json({
                    error: "server error",
                });
            } else {
                return res.status(200).json({
                    message: "Successfully updated",
                    task: result,
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