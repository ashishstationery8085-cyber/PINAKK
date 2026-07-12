import { Schema, model } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  parent?: string;
  description?: string;
  image?: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default model<ICategory>('Category', categorySchema);
