import { Schema, model } from "mongoose";

// Attachment data
export interface Attachment {
    /**
     * Buffer or link of an image
     */
    buffer?: string;
    /**
     * (Optional) Name of the image
     */
    name?: string;
}

/**
 * Message class 
 */
 export interface Message {
    /**
     * Unique ID of message
     */
    readonly id: string;
    /**
     * ID of the author
     */
    readonly authorId: string;
    /**
     * Message content
     */
    readonly content?: string;
    /**
     * Created at 
     */
    readonly date: Date;
    /**
     * Was message edited
     */
    readonly edited?: boolean;
    /**
     * Files, images and etc
     */
    readonly attachments?: Attachment[]
} 

export const Message = model("message", new Schema<Message>({
    id: { type: String, required: true, unique: true },
    authorId: { type: String, required: true },
    attachments: { type: Array, default: [] } as any,
    date: { type: Date, required: true },
    content: { type: String },
    edited: { type: Boolean, default: false }
}))

export const MessageKeys: ReadonlyArray<keyof Message> = ["attachments", "authorId", "content", "date", "edited", "id"];