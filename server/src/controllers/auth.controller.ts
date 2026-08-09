import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import sendEmail from '../utils/email';

interface JwtPayload {
  userId: string;
  role: string;
}

const signToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign({ userId: id, role }, secret, { expiresIn: '7d' });
};

const createReferralCode = () => {
  return `PIN${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

export const register = async (req: Request, res: Response) => {
  const { name, email, mobile, password, referredBy } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const referralCode = createReferralCode();

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        ...(mobile ? [{ mobile }] : [])
      ]
    }
  });
  if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      mobile: mobile || null,
      password: hashedPassword,
      referralCode,
      referredBy: referredBy || null,
    }
  });

  const token = signToken(user.id, user.role);
  res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = signToken(user.id, user.role);
  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const otpLogin = async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ success: false, message: 'Mobile and OTP required' });
  
  const user = await prisma.user.findUnique({
    where: { mobile }
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  // In production, verify OTP against stored OTP (e.g., Redis or database)
  // For now, accept any 6-digit OTP as valid (implement proper OTP service in production)
  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return res.status(400).json({ success: false, message: 'Invalid OTP format' });
  }
  
  const token = signToken(user.id, user.role);
  res.json({ success: true, token, user: { id: user.id, mobile: user.mobile, role: user.role } });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  await sendEmail(email, 'Reset your PINAKK password', `<p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`);
  res.json({ success: true, message: 'Password reset instructions sent to your email' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password are required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const profile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ success: true, user });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    const newToken = signToken(decoded.userId, decoded.role);
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
