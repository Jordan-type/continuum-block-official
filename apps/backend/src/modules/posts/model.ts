import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
    userId: string;
    title: string;
    content: string;
    category: string;
    slug: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
  }


const postSchema = new Schema<IPost>({
        userId: { type: String, required: true },
        title: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        image: {
            type: String,
            default:
                'https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/anatomy-of-a-blog-post-deconstructed-open-graph.jpg',
        },
        category: { type: String, default: 'uncategorized' },
    },
    { timestamps: true });

const PostModel = model<IPost>('Post', postSchema);
export default PostModel;