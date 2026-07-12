import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: Schema.Types.Mixed,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const shippingSchema = new Schema({
  address: Schema.Types.Mixed,
  method: String,
  slot: String,
  fee: Number,
  trackingId: String,
});

const paymentSchema = new Schema({
  method: String,
  provider: String,
  status: String,
  transactionId: String,
  amount: Number,
});

export interface IOrder {
  user: string;
  items: Array<any>;
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  payment: any;
  shippingDetails: any;
  vendor?: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  payment: paymentSchema,
  shippingDetails: shippingSchema,
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now },
});

export default model<IOrder>('Order', orderSchema);
