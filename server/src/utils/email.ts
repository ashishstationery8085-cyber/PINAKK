import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@pinakk.com',
    to,
    subject,
    html,
  });
};

// Input validation utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000000;
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= 100;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateProductInput = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || !validateName(data.name)) {
    errors.push('Product name is required and must be at least 2 characters');
  }

  if (!data.price || !validatePrice(data.price)) {
    errors.push('Valid price is required');
  }

  if (!data.category || !validateName(data.category)) {
    errors.push('Category is required');
  }

  if (data.stock !== undefined && (data.stock < 0 || data.stock > 10000)) {
    errors.push('Stock must be between 0 and 10000');
  }

  return { valid: errors.length === 0, errors };
};

export const validateAddressInput = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.fullName || !validateName(data.fullName)) {
    errors.push('Full name is required');
  }

  if (!data.mobile || !validateMobile(data.mobile)) {
    errors.push('Valid mobile number is required');
  }

  if (!data.address || data.address.trim().length < 10) {
    errors.push('Address must be at least 10 characters');
  }

  if (!data.city || !validateName(data.city)) {
    errors.push('City is required');
  }

  if (!data.pincode || !/^\d{6}$/.test(data.pincode)) {
    errors.push('Valid 6-digit pincode is required');
  }

  return { valid: errors.length === 0, errors };
};

export default sendEmail;
