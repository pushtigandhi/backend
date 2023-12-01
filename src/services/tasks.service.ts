import { Task, ITask } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class TaskService {
    public task_model = Task;

    public async getTasks(): Promise<Array<HydratedDocument<ITask>>> {
        const tasks = this.task_model.find();
        return tasks;
    }

    public async getTaskById(
        id: string
    ): Promise<HydratedDocument<ITask> | null> {
        const task = await this.task_model.findById(id);
        return task as HydratedDocument<ITask> | null;
    }

    public async addTask(item: ITask): Promise<HydratedDocument<ITask>> {
        //console.log("add item service");
        const newTask = this.task_model.create(item);
        return newTask;
    }

    public async deletedTask(taskId: Types.ObjectId): Promise<ITask | null> {
        const deletedTask = await this.task_model.findOneAndDelete({ _id: taskId });
        return deletedTask;
    }

    public async editTask(
        id: Types.ObjectId,
        updateObj: any,
    ): Promise<HydratedDocument<ITask> | null> {
        const task = await this.task_model.findById(id);
    
        if (!task) {
            return null;
        }
    
        try {
            const updatedTask = await this.task_model.findOneAndUpdate(
                { _id: id },
                updateObj,
                { new: true }
            );
            return updatedTask;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}