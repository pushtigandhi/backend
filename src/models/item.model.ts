import mongoose, { Schema, model } from "mongoose";
import ContactCard,{IContactCard} from "./contactcard.model";

// interface IAddress {
//     street: string,
//     city: string,
//     state: string,
//     postalCode: string,
// }

// const addressSchema = new mongoose.Schema({
//   street: {
//       type: String,
//       required: true,
//     },
//   city: {
//       type: String,
//       required: true,
//     },
//   state: {
//       type: String,
//       required: true,
//     },
//   postalCode: {
//       type: String,
//       required: true,
//     }
// });

interface ITag {
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
            type: [Schema.Types.ObjectId],
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
    // Include properties from the base IITem
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

// const Event = Item.discriminator('Event', eventSchema);

// const journalEntrySchema = new Schema({
//     text: {
//         type: String,
//     }
// });

// const JournalEntry = Item.discriminator('JournalEntry', journalEntrySchema);

// const recipeSchema = new Schema({
//     ingredients: {
//         type: [String],
//     },
//     directions: {
//         type: [String],
//     }
// });

// const Recipe = Item.discriminator('Recipe', recipeSchema);

// exports = {
//     Item,
//     // Task,
//     // Event,
//     // JournalEntry,
//     // Recipe,
// };
export const Item = model<IItem>('Item', itemSchema);
export const Task = model<ITask>('Task', taskSchema);
export const Event = model<IEvent>('Event', eventSchema);

//export default Item;