import { Schema, model } from 'mongoose';

export interface ICoupon {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minimumOrderValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: Date;
  expiryDate: Date;
  active: boolean;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  description: String,
  discountType: { type: String, enum: ['flat', 'percentage'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minimumOrderValue: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

export default model<ICoupon>('Coupon', couponSchema);
