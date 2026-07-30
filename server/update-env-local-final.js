const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `# Server
MONGO_URI=mongodb://localhost:27017/pinakk
JWT_SECRET=replace_with_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=replace_cloud_name
CLOUDINARY_API_KEY=replace_api_key
CLOUDINARY_API_SECRET=replace_api_secret
RAZORPAY_KEY_ID=replace_razorpay_key
RAZORPAY_KEY_SECRET=replace_razorpay_secret
STRIPE_SECRET_KEY=replace_stripe_secret
STRIPE_WEBHOOK_SECRET=replace_stripe_webhook_secret
NODE_ENV=production
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ .env file updated with local MongoDB URI');
