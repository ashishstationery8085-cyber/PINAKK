import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get delivery boy dashboard - orders assigned to them
export const getDeliveryDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    // Find delivery boy
    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { userId }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy profile not found' });
    }

    // Get orders assigned to this delivery boy
    const orders = await prisma.order.findMany({
      where: { deliveryBoyId: deliveryBoy.id },
      include: {
        user: { select: { name: true, email: true, mobile: true } },
        items: {
          include: { product: { select: { name: true, price: true, images: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get delivery stats
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      processingOrders: orders.filter(o => o.status === 'PROCESSING').length,
      outForDeliveryOrders: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
      deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
      totalDeliveries: deliveryBoy.totalDeliveries,
      rating: deliveryBoy.rating,
      isAvailable: deliveryBoy.isAvailable
    };

    res.json({
      success: true,
      deliveryBoy: {
        id: deliveryBoy.id,
        name: (req as any).userName,
        vehicleType: deliveryBoy.vehicleType,
        vehicleNumber: deliveryBoy.vehicleNumber,
        rating: deliveryBoy.rating,
        totalDeliveries: deliveryBoy.totalDeliveries,
        isAvailable: deliveryBoy.isAvailable
      },
      stats,
      orders
    });
  } catch (error) {
    console.error('Error fetching delivery dashboard:', error);
    res.status(500).json({ success: false, message: 'Error fetching delivery dashboard' });
  }
};

// Get single order details
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user?.id;

    // Verify delivery boy owns this order
    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { userId }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy profile not found' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        deliveryBoyId: deliveryBoy.id
      },
      include: {
        user: true,
        items: {
          include: { product: true }
        },
        deliveryBoy: {
          include: {
            locations: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Error fetching order details' });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Verify delivery boy owns this order
    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { userId }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy profile not found' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        deliveryBoyId: deliveryBoy.id
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        user: true,
        items: { include: { product: true } }
      }
    });

    res.json({ success: true, message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
};

// Update delivery boy location
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, address, orderId } = req.body;
    const userId = (req as any).user?.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    // Find delivery boy
    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { userId }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy profile not found' });
    }

    // Save location
    const location = await prisma.deliveryLocation.create({
      data: {
        deliveryBoyId: deliveryBoy.id,
        orderId: orderId || null,
        latitude,
        longitude,
        address: address || null
      }
    });

    res.json({ success: true, message: 'Location updated', location });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ success: false, message: 'Error updating location' });
  }
};

// Get delivery boy live location
export const getLiveLocation = async (req: Request, res: Response) => {
  try {
    const { deliveryBoyId } = req.params;

    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { id: deliveryBoyId },
      include: {
        user: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy not found' });
    }

    if (!deliveryBoy.locations || deliveryBoy.locations.length === 0) {
      return res.status(404).json({ success: false, message: 'No location data available' });
    }

    res.json({
      success: true,
      deliveryBoy: {
        id: deliveryBoy.id,
        name: deliveryBoy.user?.name || 'Unknown'
      },
      location: deliveryBoy.locations[0]
    });
  } catch (error) {
    console.error('Error fetching live location:', error);
    res.status(500).json({ success: false, message: 'Error fetching location' });
  }
};

// Get delivery location history
export const getLocationHistory = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user?.id;

    // Find delivery boy
    const deliveryBoy = await prisma.deliveryBoy.findUnique({
      where: { userId }
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy profile not found' });
    }

    // Get location history for the order
    const locations = await prisma.deliveryLocation.findMany({
      where: {
        deliveryBoyId: deliveryBoy.id,
        orderId: orderId
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json({ success: true, locations });
  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({ success: false, message: 'Error fetching location history' });
  }
};

// Mark delivery boy available/unavailable
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { isAvailable } = req.body;
    const userId = (req as any).user?.id;

    const deliveryBoy = await prisma.deliveryBoy.update({
      where: { userId },
      data: { isAvailable }
    });

    res.json({ success: true, message: 'Availability updated', deliveryBoy });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ success: false, message: 'Error updating availability' });
  }
};
