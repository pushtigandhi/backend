import { Task, ITask } from "../models/item.model"
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

export default class TaskService {
    public task_model = Task;

    public async getTasks(): Promise<Array<HydratedDocument<ITask>>> {
        const tasks = this.task_model.find();
        return tasks;
    }

    public async addTask(item: ITask): Promise<HydratedDocument<ITask>> {
        //console.log("add item service");
        const newTask = this.task_model.create(item);
        return newTask;
    }
}