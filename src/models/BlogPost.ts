import { Document, Schema, model } from 'mongoose';
import { IUser } from './User';

export interface IBlogPost extends Document {
    message: string;
    author: IUser['_id'];
    createdAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
    {
        message: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default model<any>('BlogPost', BlogPostSchema);