import { Schema, model } from 'mongoose';

export interface IVendor {
  user: string;
  storeName: string;
  verified: boolean;
  products: string[];
  orders: string[];
  earnings: number;
  payoutAccount: any;
  createdAt: Date;
}

const vendorSchema = new Schema<IVendor>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true },
  verified: { type: Boolean, default: false },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  earnings: { type: Number, default: 0 },
  payoutAccount: {
    bankName: String,
    accountNumber: String,
    ifsc: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IVendor>('Vendor', vendorSchema);
