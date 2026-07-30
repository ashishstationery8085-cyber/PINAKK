const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models from dist folder (compiled TypeScript)
const Product = require('../dist/models/product.model').default;
const Category = require('../dist/models/category.model').default;
const User = require('../dist/models/user.model').default;

// Demo products data
const products = require('./products');

const categories = [
  { name: 'Stationery', slug: 'stationery', description: 'All types of stationery items', parent: null },
  { name: 'Notebooks', slug: 'notebooks', description: 'Notebooks and journals', parent: 'stationery' },
  { name: 'Pens', slug: 'pens', description: 'Ball pens, gel pens, fountain pens', parent: 'stationery' },
  { name: 'Pencils', slug: 'pencils', description: 'Drawing pencils, mechanical pencils', parent: 'stationery' },
  { name: 'Erasers', slug: 'erasers', description: 'Erasers and sharpeners', parent: 'stationery' },
  { name: 'Paper Products', slug: 'paper', description: 'Paper sheets, pads, and cards', parent: null },
  { name: 'Office Supplies', slug: 'office', description: 'Office essentials and desk supplies', parent: null },
  { name: 'Files & Folders', slug: 'files-folders', description: 'File organizers and folders', parent: 'office' },
  { name: 'Desk Organizers', slug: 'desk-organizers', description: 'Desk organizers and storage', parent: 'office' },
  { name: 'Calculators', slug: 'calculators', description: 'Scientific and basic calculators', parent: 'office' },
  { name: 'Gifts', slug: 'gifts', description: 'Gift items and novelties', parent: null },
  { name: 'Perfumes', slug: 'perfumes', description: 'Perfumes and deodorants', parent: null },
  { name: 'Belts', slug: 'belts', description: 'Men and women belts', parent: null },
  { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', parent: null },
  { name: 'Art Supplies', slug: 'art-supplies', description: 'Art and craft supplies', parent: null },
  { name: 'Colors', slug: 'colors', description: 'Crayons, water colors, oil pastels', parent: 'art-supplies' },
  { name: 'Brushes', slug: 'brushes', description: 'Paint brushes of all types', parent: 'art-supplies' },
  { name: 'General Store', slug: 'general', description: 'General store items', parent: null },
];

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/pinakk';

// Use MongoDB URI directly for SRV connection
let fixedMongoURI = MONGODB_URI;

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', fixedMongoURI.replace(/:([^:@]+)@/, ':****@'));
    
    await mongoose.connect(fixedMongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    // Seed categories
    console.log('📁 Seeding categories...');
    const createdCategories = {};
    for (const category of categories) {
      const parentCategory = category.parent ? createdCategories[category.parent] : null;
      const created = await Category.create({
        ...category,
        parent: parentCategory?._id || null,
      });
      createdCategories[category.slug] = created;
    }
    console.log(`✅ Created ${Object.keys(createdCategories).length} categories`);

    // Seed products
    console.log('📦 Seeding products...');
    const categoryMap = {
      'Notebooks': createdCategories['notebooks']?._id,
      'Pens': createdCategories['pens']?._id,
      'Pencils': createdCategories['pencils']?._id,
      'Erasers': createdCategories['erasers']?._id,
      'Paper Products': createdCategories['paper']?._id,
      'Files & Folders': createdCategories['files-folders']?._id,
      'Desk Organizers': createdCategories['desk-organizers']?._id,
      'Calculators': createdCategories['calculators']?._id,
      'Gifts': createdCategories['gifts']?._id,
      'Perfumes': createdCategories['perfumes']?._id,
      'Belts': createdCategories['belts']?._id,
      'Accessories': createdCategories['accessories']?._id,
      'Art Supplies': createdCategories['art-supplies']?._id,
      'Colors': createdCategories['colors']?._id,
      'Brushes': createdCategories['brushes']?._id,
      'General Store': createdCategories['general']?._id,
    };

    const productsToInsert = products.map(product => ({
      ...product,
      category: categoryMap[product.category] || createdCategories['stationery']?._id,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
      reviews: [],
      status: 'active',
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${Object.keys(createdCategories).length}`);
    console.log(`   - Products: ${createdProducts.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
