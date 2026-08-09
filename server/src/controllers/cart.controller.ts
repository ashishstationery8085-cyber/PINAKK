import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        where: { userId },
        data: { userId }
      });
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, variantId, quantity = 1 } = req.body;
    
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }
    
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId
      }
    });
    
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity
        }
      });
    }
    
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.max(1, quantity) }
    });
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ success: false, message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;
    
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId
        }
      }
    });
    
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
};
