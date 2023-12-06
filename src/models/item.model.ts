import mongoose, { Schema, model } from "mongoose";

export interface ITag {
    name: string;
    color: string;
}

const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "#FAFAFC"
    }
});

export interface IItem {
    title: string;
    category: string;
    section?: string;
    icon: string;
    favicon?: {
        data: Buffer;
        contentType: string;
    };
    tags?: [ITag];
    description?: string;
    startDate?: Date;
    endDate?: Date;
    duration?: Number;
    repeat?: [string];
    priority?: string;
    notes?: [string];
    createdAt: Date;
    updatedAt?: Date;
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
            type: [tagSchema],
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
        duration: {
            type: Number,
        },
        repeat: {
            type: [String],
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
        },
        notes: {
            type: [String],
        }
    },
    {
        timestamps: true,
        discriminatorKey: 'itemType',
    }
);

export interface ITask extends IItem {
    subtasks: [String],
}

const taskSchema = new Schema({
    // Include properties from the base IITem
    ...itemSchema.obj,

    subtasks: {
        type: [String],
        default: [],
    }
});

export interface IEvent extends IItem {
    contacts: [Schema.Types.ObjectId],
    location: string,
    address: Schema.Types.ObjectId,
    checklist: [string],
}

const eventSchema = new Schema({

    ...itemSchema.obj,
    
    contacts: {
        type: [Schema.Types.ObjectId],
    },
    location: {
        type: String,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
    },
    checklist: {
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
export const Task = model<ITask>('Task', taskSchema);
export const Event = model<IEvent>('Event', eventSchema);
export const Page = model<IPage>('Page', pageSchema);
export const Recipe = model<IRecipe>('Recipe', recipeSchema);
export const Tag = model<ITag>('Tag', tagSchema);

//export default Item;