import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { shippingAddress, billingAddress, paymentMethod, items, notes } = req.body;
  
  const orderItems = items || [];
  const subtotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const orderNumber = `ORD${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      notes,
      shippingAddress,
      billingAddress,
      items: {
        create: orderItems.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        }))
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        userId
      }
    }
  });

  res.status(201).json({ success: true, order });
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: (req as any).user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      select: { status: true, shippingAddress: true }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, status: order.status, tracking: order.shippingAddress });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ success: false, message: 'Error tracking order' });
  }
};
