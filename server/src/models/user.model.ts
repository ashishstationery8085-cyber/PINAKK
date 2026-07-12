import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  addresses: Array<any>;
  favoriteProducts: string[];
  createdAt: Date;
}

const addressSchema = new Schema({
  label: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'vendor'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: String,
  addresses: [addressSchema],
  favoriteProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>('User', userSchema);
