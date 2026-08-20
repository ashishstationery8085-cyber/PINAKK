import prisma from '../lib/prisma';

const categories = [
  {
    name: 'Notebooks',
    slug: 'notebooks',
    description: 'Premium notebooks for study, journaling, and planning.',
  },
  {
    name: 'Pens',
    slug: 'pens',
    description: 'Everyday writing tools for students, creators, and professionals.',
  },
  {
    name: 'Art Supplies',
    slug: 'art-supplies',
    description: 'Professional art supplies for painting, drawing, and creativity.',
  },
  {
    name: 'Desk Essentials',
    slug: 'desk-essentials',
    description: 'Practical accessories that keep your workspace organized.',
  },
  {
    name: 'Stationery Sets',
    slug: 'stationery-sets',
    description: 'Complete sets for students and professionals.',
  },
  {
    name: 'Sketchbooks',
    slug: 'sketchbooks',
    description: 'Professional sketchbooks for artists and designers.',
  },
];

const products = [
  // Notebooks
  {
    name: 'Signature Notebook',
    slug: 'signature-notebook',
    sku: 'PIN-NB-001',
    category: 'notebooks',
    subcategory: 'notebooks',
    description: 'A premium A4 notebook designed for focused work and daily planning.',
    features: ['200 ruled pages', 'Durable covers', 'Smooth paper finish'],
    price: 149,
    stock: 120,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    name: 'Premium Sketchbook',
    slug: 'premium-sketchbook',
    sku: 'PIN-SK-001',
    category: 'notebooks',
    subcategory: 'sketchbooks',
    description: 'Professional-grade sketchbook with acid-free paper for artists.',
    features: ['100 sheets', 'Acid-free paper', 'Spiral binding'],
    price: 299,
    stock: 85,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900'],
    rating: 4.9,
    status: 'active',
  },
  {
    name: 'Journal Notebook',
    slug: 'journal-notebook',
    sku: 'PIN-JN-001',
    category: 'notebooks',
    subcategory: 'notebooks',
    description: 'Elegant journal notebook for daily reflections and planning.',
    features: ['Leather cover', 'Lined pages', 'Bookmark ribbon'],
    price: 249,
    stock: 100,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=900'],
    rating: 4.7,
    status: 'active',
  },
  {
    name: 'Student Notebook Set',
    slug: 'student-notebook-set',
    sku: 'PIN-NS-001',
    category: 'notebooks',
    subcategory: 'stationery-sets',
    description: 'Complete set of notebooks for students with different subjects.',
    features: ['5 notebooks', 'Subject dividers', 'Sturdy binding'],
    price: 399,
    stock: 60,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900'],
    rating: 4.6,
    status: 'active',
  },
  // Pens
  {
    name: 'Precision Gel Pen',
    slug: 'precision-gel-pen',
    sku: 'PIN-PG-001',
    category: 'pens',
    subcategory: 'pens',
    description: 'A smooth-writing gel pen with a comfortable grip for long sessions.',
    features: ['0.7mm tip', 'Fast-drying ink', 'Ergonomic grip'],
    price: 49,
    stock: 240,
    discount: 5,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.7,
    status: 'active',
  },
  {
    name: 'Executive Ballpoint Pen',
    slug: 'executive-ballpoint-pen',
    sku: 'PIN-BP-001',
    category: 'pens',
    subcategory: 'pens',
    description: 'Luxury ballpoint pen with metal finish and smooth ink flow.',
    features: ['Metal body', 'Smooth ink', 'Premium finish'],
    price: 199,
    stock: 150,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.6,
    status: 'active',
  },
  {
    name: 'Fountain Pen Set',
    slug: 'fountain-pen-set',
    sku: 'PIN-FP-001',
    category: 'pens',
    subcategory: 'stationery-sets',
    description: 'Elegant fountain pen set with ink cartridges and converter.',
    features: ['3 pens', 'Ink cartridges', 'Converter included'],
    price: 599,
    stock: 40,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    name: 'Gel Pen Pack',
    slug: 'gel-pen-pack',
    sku: 'PIN-GP-002',
    category: 'pens',
    subcategory: 'stationery-sets',
    description: 'Pack of 12 colorful gel pens for creative work.',
    features: ['12 colors', 'Fine tip', 'Quick-dry ink'],
    price: 299,
    stock: 80,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.5,
    status: 'active',
  },
  // Art Supplies
  {
    name: 'Art Canvas Set',
    slug: 'art-canvas-set',
    sku: 'PIN-AC-001',
    category: 'art-supplies',
    subcategory: 'art-supplies',
    description: 'Professional canvas set for painting and artwork.',
    features: ['5 canvases', 'Stretched cotton', 'Primed surface'],
    price: 599,
    stock: 45,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    name: 'Brush Collection Set',
    slug: 'brush-collection-set',
    sku: 'PIN-BC-001',
    category: 'art-supplies',
    subcategory: 'brushes',
    description: 'Complete brush set for various painting techniques.',
    features: ['12 brushes', 'Natural hair', 'Wooden handles'],
    price: 449,
    stock: 60,
    discount: 12,
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900'],
    rating: 4.7,
    status: 'active',
  },
  {
    name: 'Watercolor Paint Set',
    slug: 'watercolor-paint-set',
    sku: 'PIN-WC-001',
    category: 'art-supplies',
    subcategory: 'colors',
    description: 'Professional watercolor paint set with 24 vibrant colors.',
    features: ['24 colors', 'High pigment', 'Portable case'],
    price: 399,
    stock: 55,
    discount: 18,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    name: 'Acrylic Paint Set',
    slug: 'acrylic-paint-set',
    sku: 'PIN-AP-001',
    category: 'art-supplies',
    subcategory: 'colors',
    description: 'Professional acrylic paint set with 36 colors.',
    features: ['36 colors', 'Quick-drying', 'Vibrant finish'],
    price: 549,
    stock: 50,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900'],
    rating: 4.6,
    status: 'active',
  },
  // Desk Essentials
  {
    name: 'Desk Organizer',
    slug: 'desk-organizer',
    sku: 'PIN-DO-001',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Modern desk organizer for keeping your workspace tidy.',
    features: ['Multiple compartments', 'Wooden finish', 'Compact design'],
    price: 349,
    stock: 90,
    discount: 8,
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900'],
    rating: 4.5,
    status: 'active',
  },
  {
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    sku: 'PIN-DL-001',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Adjustable LED desk lamp with multiple brightness levels.',
    features: ['Touch control', 'USB charging', 'Flexible neck'],
    price: 599,
    stock: 70,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900'],
    rating: 4.6,
    status: 'active',
  },
  {
    name: 'Pen Holder Set',
    slug: 'pen-holder-set',
    sku: 'PIN-PH-001',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Elegant pen holder set for desk organization.',
    features: ['3 holders', 'Ceramic finish', 'Non-slip base'],
    price: 199,
    stock: 110,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900'],
    rating: 4.4,
    status: 'active',
  },
  {
    name: 'Desk Calendar',
    slug: 'desk-calendar',
    sku: 'PIN-DC-001',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Premium desk calendar with monthly pages.',
    features: ['12 months', 'Premium paper', 'Stand included'],
    price: 149,
    stock: 130,
    discount: 5,
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900'],
    rating: 4.3,
    status: 'active',
  },
  // Sketchbooks
  {
    name: 'Professional Sketchbook',
    slug: 'professional-sketchbook',
    sku: 'PIN-PS-001',
    category: 'sketchbooks',
    subcategory: 'sketchbooks',
    description: 'Professional sketchbook with heavyweight paper for detailed work.',
    features: ['80 sheets', '160gsm paper', 'Hardcover'],
    price: 349,
    stock: 75,
    discount: 12,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900'],
    rating: 4.7,
    status: 'active',
  },
  {
    name: 'Travel Sketchbook',
    slug: 'travel-sketchbook',
    sku: 'PIN-TS-001',
    category: 'sketchbooks',
    subcategory: 'sketchbooks',
    description: 'Compact sketchbook perfect for travel and outdoor sketching.',
    features: ['50 sheets', 'Pocket size', 'Elastic band'],
    price: 199,
    stock: 95,
    discount: 8,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900'],
    rating: 4.5,
    status: 'active',
  },
  // Stationery Sets
  {
    name: 'Complete Student Kit',
    slug: 'complete-student-kit',
    sku: 'PIN-CS-001',
    category: 'stationery-sets',
    subcategory: 'stationery-sets',
    description: 'Complete stationery kit for students with all essentials.',
    features: ['Notebooks', 'Pens', 'Pencils', 'Eraser', 'Sharpener'],
    price: 499,
    stock: 55,
    discount: 25,
    images: ['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900'],
    rating: 4.6,
    status: 'active',
  },
  {
    name: 'Office Essentials Set',
    slug: 'office-essentials-set',
    sku: 'PIN-OE-001',
    category: 'stationery-sets',
    subcategory: 'stationery-sets',
    description: 'Essential office stationery set for professionals.',
    features: ['Pens', 'Notepads', 'Sticky notes', 'Highlighters'],
    price: 399,
    stock: 65,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900'],
    rating: 4.4,
    status: 'active',
  },
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.couponUsage.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.settings.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.review.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.favoriteProduct.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productRelation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = await prisma.category.createMany({ data: categories });
    console.log(`✅ Created ${createdCategories.count} categories`);

    const categoryRecords = await prisma.category.findMany({ where: { slug: { in: categories.map((c) => c.slug) } } });
    const categoryMap = new Map(categoryRecords.map(cat => [cat.slug, cat.id]));

    // Map category slugs to IDs in products
    const productsWithCategories = products.map(product => {
      const { category, subcategory, images, features, discount, status, ...rest } = product;
      return {
        ...rest,
        categoryId: categoryMap.get(category),
        subcategoryId: categoryMap.get(subcategory) || categoryMap.get(category),
        images: Array.isArray(images) ? JSON.stringify(images) : images,
        features: Array.isArray(features) ? JSON.stringify(features) : features,
        discountPrice: discount ? (product.price * (1 - discount / 100)) : null,
        isActive: status === 'active',
      };
    });

    // Create products
    const createdProducts = await prisma.product.createMany({ data: productsWithCategories as any[] });
    console.log(`✅ Created ${createdProducts.count} products`);

    console.log('🎉 Database seeding completed successfully!');
    return {
      success: true,
      categories: createdCategories.count,
      products: createdProducts.count,
    };
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
