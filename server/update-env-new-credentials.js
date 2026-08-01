const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envContent = `MONGO_URI=mongodb+srv://ashishstationery8085_db_user:campMjluWRgS63nm@cluster0.r2xqgoj.mongodb.net/?appName=Cluster0
JWT_SECRET=pinakk_jwt_secret_key_2024
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=development
PORT=4000
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ .env file updated with new MongoDB credentials');
console.log('MongoDB URI: mongodb+srv://ashishstationery8085_db_user:campMjluWRgS63nm@cluster0.r2xqgoj.mongodb.net/?appName=Cluster0');
