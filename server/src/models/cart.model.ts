import { Schema, model } from 'mongoose';

export interface ICart {
  user: string;
  items: Array<any>;
  createdAt: Date;
}

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: Schema.Types.Mixed,
  quantity: { type: Number, default: 1 },
  savedForLater: { type: Boolean, default: false },
});

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export default model<ICart>('Cart', cartSchema);
