import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const payload = jwt.verify(token, secret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, mobile: true, role: true }
    });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowedRoles = roles.map((role) => role.toLowerCase());
  const userRole = req.user?.role?.toLowerCase?.() ?? '';

  if (!req.user || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

// Rate limiting middleware (requires express-rate-limit)
// Add to package.json: "express-rate-limit": "^7.1.5"
/*
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
*/
