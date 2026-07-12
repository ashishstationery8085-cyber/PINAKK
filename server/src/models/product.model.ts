import { Schema, model } from 'mongoose';

const variantSchema = new Schema({
  sku: String,
  price: Number,
  mrp: Number,
  stock: Number,
  attributes: Schema.Types.Mixed,
});

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  title: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const faqSchema = new Schema({
  question: String,
  answer: String,
});

export interface IProduct {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  variants: Array<any>;
  price: number;
  stock: number;
  discount: number;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviews: Array<any>;
  questions: Array<any>;
  relatedProducts: string[];
  status: string;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, index: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  features: [String],
  variants: [variantSchema],
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  images: [String],
  videoUrl: String,
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  questions: [faqSchema],
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default model<IProduct>('Product', productSchema);
