'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { authHeaders, getAuthToken } from '../../../../lib/auth';
import { FiMapPin, FiTruck, FiCheckCircle, FiClock, FiPhone, FiMessageSquare } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  user: { name: string; email: string; mobile?: string };
  shippingAddress: any;
  items: any[];
  deliveryBoy?: {
    id: string;
    locations?: Array<{
      latitude: number;
      longitude: number;
      address?: string;
      timestamp: string;
    }>;
  };
}

// Leaflet types
interface Map {
  setView: (coords: [number, number], zoom: number) => void;
  remove: () => void;
}

interface Marker {
  setLatLng: (coords: [number, number]) => void;
  setPopupContent: (content: string) => void;
}

const OrderTracking = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const deliveryMarker = useRef<Marker | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [latlng, setLatlng] = useState<[number, number] | null>(null);

  // Initialize Leaflet dynamically
  useEffect(() => {
    const initLeaflet = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        
        // Import Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css';
        document.head.appendChild(link);

        // Initialize map if element is ready
        if (mapContainer.current && !map.current) {
          // Default to India center
          const defaultLat = latlng ? latlng[0] : 28.7041;
          const defaultLng = latlng ? latlng[1] : 77.1025;

          map.current = L.map(mapContainer.current).setView([defaultLat, defaultLng], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map.current);
        }
      } catch (error) {
        console.error('Error initializing Leaflet:', error);
      }
    };

    initLeaflet();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latlng]);

  useEffect(() => {
    if (!getAuthToken()) {
      setMessage('Please login to track your order');
      return;
    }
    fetchOrder();
    
    // Poll for location updates every 5 seconds
    const interval = setInterval(fetchDeliveryLocation, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }

      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: requestHeaders
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
        if (data.order.deliveryBoyId) {
          fetchDeliveryLocation(data.order.deliveryBoyId);
        }
      } else {
        setMessage(data.message || 'Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setMessage('Error fetching order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryLocation = async (deliveryBoyId?: string) => {
    try {
      const dbId = deliveryBoyId || order?.deliveryBoy?.id;
      if (!dbId) return;

      const response = await fetch(`${API_BASE}/delivery/live-location/${dbId}`);
      const data = await response.json();

      if (data.success && data.location) {
        setDeliveryLocation(data.location);
        setLatlng([data.location.latitude, data.location.longitude]);

        // Update map if available
        if (map.current && deliveryMarker.current) {
          deliveryMarker.current.setLatLng([data.location.latitude, data.location.longitude]);
          deliveryMarker.current.setPopupContent(
            `<div><strong>Delivery Boy</strong><br/>${data.location.address || 'Delivering...'}</div>`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching delivery location:', error);
    }
  };

  useEffect(() => {
    if (!map.current || !deliveryLocation) return;

    // Add delivery marker if not exists
    if (!deliveryMarker.current) {
      const L = require('leaflet').default;
      const icon = L.icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      });

      deliveryMarker.current = L.marker([deliveryLocation.latitude, deliveryLocation.longitude], {
        icon: icon
      })
        .addTo(map.current)
        .bindPopup(`<div><strong>Delivery Boy</strong><br/>${deliveryLocation.address || 'Delivering...'}</div>`)
        .openPopup();
    }
  }, [deliveryLocation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <FiCheckCircle size={24} className="text-green-600" />;
      case 'OUT_FOR_DELIVERY':
        return <FiTruck size={24} className="text-blue-600" />;
      case 'PROCESSING':
        return <FiClock size={24} className="text-yellow-600" />;
      default:
        return <FiClock size={24} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiTruck className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-gray-900">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">{message || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="flex justify-center mb-2">
                {getStatusIcon('PROCESSING')}
              </div>
              <p className="text-sm font-semibold text-gray-900">Processing</p>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-2"></div>

            <div className="text-center flex-1">
              <div className="flex justify-center mb-2">
                {getStatusIcon('OUT_FOR_DELIVERY')}
              </div>
              <p className="text-sm font-semibold text-gray-900">On The Way</p>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}
            ></div>

            <div className="text-center flex-1">
              <div className="flex justify-center mb-2">
                {getStatusIcon('DELIVERED')}
              </div>
              <p className="text-sm font-semibold text-gray-900">Delivered</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === 'DELIVERED'
                ? 'bg-green-100 text-green-800'
                : order.status === 'OUT_FOR_DELIVERY'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              Current Status: {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Live Map */}
        {order.status === 'OUT_FOR_DELIVERY' && deliveryLocation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FiMapPin className="mr-2" /> Live Tracking
            </h2>
            <div
              ref={mapContainer}
              style={{
                height: '400px',
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Delivery Location:</strong> {deliveryLocation.address || 'Getting location...'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Coordinates:</strong> {deliveryLocation.latitude.toFixed(6)}, {deliveryLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h3>
            <div className="text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900">{order.user.name}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className="mt-4 pt-4 border-t border-gray-200">
                <strong>Phone:</strong> {order.user.mobile || order.user.email}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-600">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-gray-900 font-bold">
                  <span>Total Amount</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        {order.status === 'OUT_FOR_DELIVERY' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                <FiPhone size={20} />
                <span>Call Delivery Boy</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
                <FiMessageSquare size={20} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
