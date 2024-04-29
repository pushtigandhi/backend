import mongoose, { Types, Schema, model } from "mongoose";

export enum ItemType {
    Item = 'ITEM',
    Task = 'TASK',
    Event = 'EVENT',
    Page = 'PAGE',
    Recipe = 'RECIPE',
    Scheduled = 'SCHEDULED',
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
        duration: {
            type: Number,
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
    isChecked: Boolean,
    subtasks: [IsubTask],
    priority?: string;
}

const taskSchema = new Schema({
    // Include properties from the base IITem
    ...itemSchema.obj,

    isChecked: {
        type: Boolean,
        default: false,
    },
    subtasks: {
        type: [subtaskSchema],
        default: [],
    },
    priority: {
        type: String,
        enum: ["NONE", "LOW", "MEDIUM", "HIGH"],
    },
});

export interface IScheduled extends IItem {
    startDate?: Date;
    endDate: Date;
    isChecked: Boolean,
    repeat: [string];
    priority?: string;
    scheduledItem: [Schema.Types.ObjectId],
}

const scheduledSchema = new Schema({

    ...itemSchema.obj,

    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    repeat: {
        type: String,
        enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY"],
    },
    priority: {
        type: String,
        enum: ["NONE", "LOW", "MEDIUM", "HIGH"],
    },
    scheduledItem: {
        type: Types.ObjectId,
        ref: "Item",
        required: true
    },
});

export interface IEvent extends IScheduled {
    location: string,
    contacts: [Schema.Types.ObjectId],
    address?: Schema.Types.ObjectId,
    subtasks: [IsubTask],
}

const eventSchema = new Schema({

    ...scheduledSchema.obj,
    
    location: {
        type: String,
    },
    contacts: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Contact",
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
    },
    subtasks: {
        type: [subtaskSchema],
        default: [],
    }
});

export interface IPage extends IItem {
    notes: string,
}

const pageSchema = new Schema({

    ...itemSchema.obj,
    
    notes: {
        type: String,
    }
});

export interface IRecipe extends IItem {
    ingredients: [IsubTask],
    instructions: [IsubTask],
    servings: number
}

const recipeSchema = new Schema({
    
    ...itemSchema.obj,

    ingredients: {
        type: [subtaskSchema],
        default: [],
    },
    instructions: {
        type: [subtaskSchema],
        default: [],
    },
    servings: {
        type: Number,
    }
});

export const Item = model<IItem>('Item', itemSchema);
export const Task = Item.discriminator<ITask>('Task', taskSchema);
export const Event = Item.discriminator<IEvent>('Event', eventSchema);
export const Page = Item.discriminator<IPage>('Page', pageSchema);
export const Recipe = Item.discriminator<IRecipe>('Recipe', recipeSchema);
export const Scheduled = Item.discriminator<IScheduled>('Scheduled', scheduledSchema);