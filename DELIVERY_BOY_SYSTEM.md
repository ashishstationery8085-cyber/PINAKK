# 🚚 Delivery Boy System - Complete Setup Guide

## Overview
A complete delivery boy management system with live location tracking using OpenStreetMap/Leaflet.

---

## 🎯 Features Implemented

### 1. **Delivery Boy Role & Authentication**
- Added `DELIVERY_BOY` role to system
- Delivery boys can login with email/password
- JWT-based authentication with role verification
- Profile management (vehicle type, license, rating, etc.)

### 2. **Database Schema**
Created two new models in Prisma:

#### **DeliveryBoy Model**
```
- id (unique identifier)
- userId (linked to User model)
- vehicleType (bike, car, bicycle, van)
- vehicleNumber
- licenseNumber
- isActive (account status)
- isAvailable (online/offline status)
- rating (customer ratings)
- totalDeliveries (statistics)
- createdAt, updatedAt
```

#### **DeliveryLocation Model**
```
- id (unique identifier)
- deliveryBoyId (linked to DeliveryBoy)
- orderId (which order is being delivered)
- latitude (GPS coordinate)
- longitude (GPS coordinate)
- address (reverse geocoded address)
- timestamp (when location was recorded)
```

#### **Order Model (Updated)**
```
- Added deliveryBoyId field
- Linked to DeliveryBoy model
- Tracks which delivery boy is assigned to which order
```

---

## 🛣️ API Routes

### **Delivery Boy Routes** (Protected - Requires DELIVERY_BOY role)

#### 1. Get Dashboard
```
GET /api/delivery/dashboard
Response: {
  deliveryBoy: { id, name, vehicleType, rating, totalDeliveries, isAvailable },
  stats: { totalOrders, pendingOrders, outForDeliveryOrders, deliveredOrders },
  orders: [...]
}
```

#### 2. Get Order Details
```
GET /api/delivery/order/:orderId
Response: { success, order }
```

#### 3. Update Order Status
```
PATCH /api/delivery/order/:orderId/status
Body: { status: "PROCESSING" | "OUT_FOR_DELIVERY" | "DELIVERED" }
Response: { success, order }
```

#### 4. Update Location (Live Tracking)
```
POST /api/delivery/location
Body: {
  latitude: 28.7041,
  longitude: 77.1025,
  address: "Optional address",
  orderId: "optional-order-id"
}
Response: { success, location }
```

#### 5. Get Location History
```
GET /api/delivery/location/history/:orderId
Response: { success, locations: [...] }
```

#### 6. Update Availability
```
PATCH /api/delivery/availability
Body: { isAvailable: true | false }
Response: { success, deliveryBoy }
```

### **Public Routes** (No Auth Required - Customers can access)

#### 1. Get Live Location of Delivery Boy
```
GET /api/delivery/live-location/:deliveryBoyId
Response: {
  success,
  deliveryBoy: { id, name },
  location: { latitude, longitude, address, timestamp }
}
```

---

## 📱 Frontend Pages

### **1. Delivery Boy Dashboard**
**Location:** `/delivery/dashboard`

**Features:**
- View all assigned orders
- See order status with color coding
- Real-time statistics (pending, in-delivery, delivered orders)
- Online/Offline toggle
- One-click location sharing with customers
- Update order status with dropdown
- Display driver info (vehicle type, rating, total deliveries)

**Components:**
- Order list with quick actions
- Status tracker with visual indicators
- Availability toggle
- Share location button (uses browser geolocation)

---

### **2. Customer Order Tracking**
**Location:** `/orders/track/[orderId]`

**Features:**
- Live map showing delivery boy location
- Real-time location updates (polls every 5 seconds)
- Order status tracker with visual progress
- Delivery boy info
- Order summary with items and total
- Delivery address display
- Current location coordinates
- Call/Message delivery boy buttons (for future implementation)

**Map Features:**
- OpenStreetMap (via Leaflet)
- Zoom controls
- Delivery boy marker with custom icon
- Popup showing current address
- Auto-center map on delivery boy location

---

## 🔧 Setup Instructions

### **Backend Setup**

1. **Update Environment**
   The schema has been updated with new tables.

2. **Register Routes**
   Already added to `/server/src/app.ts`:
   ```typescript
   import deliveryRoutes from './routes/delivery.routes';
   app.use('/api/delivery', deliveryRoutes);
   ```

3. **API is Ready**
   All endpoints are implemented in:
   - `/server/src/controllers/delivery.controller.ts`
   - `/server/src/routes/delivery.routes.ts`

### **Frontend Setup**

1. **Install Dependencies**
   ```bash
   cd client
   npm install leaflet @types/leaflet
   npm run dev
   ```

2. **Pages are Ready**
   - Delivery Boy Dashboard: `/delivery/dashboard`
   - Customer Tracking: `/orders/track/[orderId]`

---

## 👤 Creating a Delivery Boy Account

### **Step 1: Create User as Delivery Boy**
```bash
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Delivery",
    "email": "john@delivery.com",
    "password": "password123",
    "mobile": "9876543210"
  }'
```

### **Step 2: Create Delivery Boy Profile**
Execute this in database or create an API endpoint:
```sql
INSERT INTO DeliveryBoy (id, userId, vehicleType, vehicleNumber, licenseNumber, isActive, isAvailable)
VALUES (
  CONCAT('db_', UUID()),
  'user-id-from-step-1',
  'bike',
  'DL-01-AB-1234',
  'DL0120060123456',
  true,
  true
);
```

### **Step 3: Assign Orders to Delivery Boy**
Update order with delivery boy ID:
```sql
UPDATE Order SET deliveryBoyId = 'delivery-boy-id' WHERE id = 'order-id';
```

---

## 🗺️ Map Technology

### **OpenStreetMap + Leaflet**
- **Why?** Free, open-source, no API key required
- **Library:** Leaflet.js v1.9.4
- **Tile Provider:** OpenStreetMap default tiles

### **Live Location Update Flow**
```
1. Delivery Boy enables location sharing
2. Browser gets GPS location via Geolocation API
3. POST to /api/delivery/location with lat/lng
4. Location saved in database
5. Customer pulls live tracking page
6. Fetches /api/delivery/live-location/:deliveryBoyId
7. Map updates with marker at new location
8. Polls every 5 seconds for updates
```

---

## 📊 Status Flow

```
PENDING
   ↓
CONFIRMED
   ↓
PROCESSING
   ↓
OUT_FOR_DELIVERY ← Delivery boy is carrying the order
   ↓
DELIVERED ← Order successfully delivered
```

---

## 🔐 Security

- **Authentication:** JWT tokens
- **Authorization:** Role-based (DELIVERY_BOY only)
- **Location Privacy:** Only customer can see their own delivery boy's location
- **Order Access:** Delivery boys can only see their assigned orders

---

## 📝 Testing the System

### **Test as Delivery Boy**

1. **Login**
   ```
   Email: john@delivery.com
   Password: password123
   → /delivery/dashboard
   ```

2. **Start Online**
   - Click "🟢 Online" button to mark yourself available

3. **Update Location**
   - Click "Share Location" on any order
   - Allow browser location access
   - Location is saved and customer can see it

4. **Update Order Status**
   - Select next status from dropdown
   - Status updates immediately

### **Test as Customer**

1. **Go to Order Tracking**
   ```
   /orders/track/[order-id]
   ```

2. **See Live Map**
   - Map shows up when order is OUT_FOR_DELIVERY
   - Delivery boy location updates every 5 seconds
   - Current coordinates and address shown

3. **Contact Delivery Boy**
   - Call/Message buttons ready for future implementation

---

## 🚀 Future Enhancements

1. **Geofencing** - Auto-mark orders as delivered when arrived
2. **OTP Verification** - Customer confirms delivery with OTP
3. **Photo Proof** - Delivery boy takes photo at delivery location
4. **Real-time Chat** - Direct messaging between customer and delivery boy
5. **Route Optimization** - Suggest optimal route to delivery boy
6. **Ratings & Reviews** - Customer rates delivery experience
7. **Push Notifications** - Notify customer when delivery boy is nearby
8. **Admin Dashboard** - Assign orders to delivery boys
9. **Delivery Boy Analytics** - Performance metrics and earnings
10. **Multi-language Support** - Regional languages for drivers

---

## 📞 Support

For issues or questions about the delivery system, check:
- `/server/src/controllers/delivery.controller.ts` - API logic
- `/client/src/app/delivery/dashboard/page.tsx` - Delivery boy UI
- `/client/src/app/orders/track/[orderId]/page.tsx` - Customer tracking UI
