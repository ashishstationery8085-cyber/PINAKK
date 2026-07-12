# PINAKK API Documentation

## Authentication
- `POST /api/auth/register`
  - body: `{ name, email, mobile, password, referredBy? }`
- `POST /api/auth/login`
  - body: `{ email, password }`
- `POST /api/auth/otp-login`
  - body: `{ mobile, otp }`
- `POST /api/auth/forgot-password`
  - body: `{ email }`
- `GET /api/auth/profile`
  - requires `Authorization: Bearer <token>`

## Products
- `GET /api/products`
  - query: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`
- `GET /api/products/:id`
- `POST /api/products`
  - requires admin or vendor
- `PUT /api/products/:id`
  - requires admin or vendor
- `DELETE /api/products/:id`
  - requires admin

## Categories
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
  - requires admin
- `PUT /api/categories/:id`
  - requires admin
- `DELETE /api/categories/:id`
  - requires admin

## Coupons
- `GET /api/coupons`
- `GET /api/coupons/:id`
- `POST /api/coupons`
  - requires admin
- `POST /api/coupons/validate`
  - body: `{ code, cartTotal }`

## Search
- `GET /api/search`
  - query: `q`, `category`, `brand`, `minPrice`, `maxPrice`
- `GET /api/search/suggestions`
  - query: `q`

## Cart
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:itemId`
- `DELETE /api/cart/:itemId`
- `POST /api/cart/save-for-later`

## Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
  - requires admin or vendor
- `GET /api/orders/:id/track`

## Payments
- `POST /api/payments/razorpay/create-order`
- `POST /api/payments/stripe/create-intent`
- `GET /api/payments/ping`

## Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `GET /api/admin/products`

## Vendors
- `POST /api/vendors/register`
- `GET /api/vendors/dashboard`
- `GET /api/vendors/products`
