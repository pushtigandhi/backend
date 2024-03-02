import mongoose, { Types, Schema, model } from "mongoose";

export enum ItemType {
    Item = 'ITEM',
    Task = 'TASK',
    Event = 'EVENT',
    Page = 'PAGE',
    Recipe = 'RECIPE'
}

const validateTimeFormat = (value) => {
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(value);
}

interface IsubTask {
    isChecked: Boolean;
    task: string;
}
const subtaskSchema = new Schema<IsubTask>({
    isChecked: {
        type: Boolean,
        default: false,
    },
    task: {
      type: String,
    },
})

export interface IItem {
    title: string;
    category: string;
    section: string;
    icon: string;
    favicon?: {
        data: Buffer;
        contentType: string;
    };
    tags: [string];
    description?: string;
    startDate?: Date;
    endDate?: Date;
    startTime?: String;
    endTime?: String;
    duration?: Number;
    repeat?: [string];
    priority?: string;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    owner: Types.ObjectId;
}

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            //: "text",
        },
        category: {
            type: String,
            default: "Backlog",
        },
        section: {
            type: String,
            default: "All",
        },
        icon: {
            type: String,
            default: "\u{1F4CD}"
        },
        favicon: {
            data: Buffer,
            contentType: String,
        },
        tags: {
            type: [String],
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        startTime: { 
            type: String, 
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ 
        },
        endTime: { 
            type: String, 
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ 
        },
        duration: {
            type: Number,
        },
        repeat: {
            type: String,
            enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY"],
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
        },
        notes: {
            type: String,
        },
        owner: {
            type: Types.ObjectId,
            ref: 'Profile',
            required: true
        },
    },
    {
        timestamps: true,
        discriminatorKey: 'itemType',
    }
);

export interface ITask extends IItem {
    subtasks: [IsubTask],
}

const taskSchema = new Schema({
    // Include properties from the base IITem
    ...itemSchema.obj,

    subtasks: {
        type: [subtaskSchema],
        default: [],
    }
});

export interface IEvent extends IItem {
    contacts: [Schema.Types.ObjectId],
    location: string,
    address: Schema.Types.ObjectId,
    subtasks: [string],
}

const eventSchema = new Schema({

    ...itemSchema.obj,
    
    contacts: {
        type: [Schema.Types.ObjectId],
        ref: "Contact",
    },
    location: {
        type: String,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
    },
    subtasks: {
        type: [String],
    }
});

export interface IPage extends IItem {
    text: string,
}

const pageSchema = new Schema({

    ...itemSchema.obj,
    
    text: {
        type: String,
    }
});

export interface IRecipe extends IItem {
    ingredients: [string],
    directions: [string],
}

const recipeSchema = new Schema({
    
    ...itemSchema.obj,

    ingredients: {
        type: [String],
    },
    directions: {
        type: [String],
    }
});

export const Item = model<IItem>('Item', itemSchema);
export const Task = Item.discriminator<ITask>('Task', taskSchema);
export const Event = Item.discriminator<IEvent>('Event', eventSchema);
export const Page = Item.discriminator<IPage>('Page', pageSchema);
export const Recipe = Item.discriminator<IRecipe>('Recipe', recipeSchema);