import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
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
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.settings.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@pinakk.com',
      mobile: '9999999999',
      password: hashedPassword,
      role: 'ADMIN',
      referralCode: 'ADMIN001',
    },
  });
  console.log('✅ Created admin user');

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@pinakk.com',
      mobile: '8888888888',
      password: userPassword,
      role: 'USER',
      referralCode: 'USER001',
    },
  });
  console.log('✅ Created demo user');

  // Create categories
  const notebookCategory = await prisma.category.create({
    data: {
      name: 'Notebooks',
      slug: 'notebooks',
      description: 'Premium notebooks for study, journaling, and planning.',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900',
    },
  });

  const pensCategory = await prisma.category.create({
    data: {
      name: 'Pens',
      slug: 'pens',
      description: 'Everyday writing tools for students, creators, and professionals.',
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900',
    },
  });

  const artSuppliesCategory = await prisma.category.create({
    data: {
      name: 'Art Supplies',
      slug: 'art-supplies',
      description: 'Professional art supplies for painting, drawing, and creativity.',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900',
    },
  });

  const deskEssentialsCategory = await prisma.category.create({
    data: {
      name: 'Desk Essentials',
      slug: 'desk-essentials',
      description: 'Practical accessories that keep your workspace organized.',
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900',
    },
  });

  const sketchbooksCategory = await prisma.category.create({
    data: {
      name: 'Sketchbooks',
      slug: 'sketchbooks',
      description: 'Professional sketchbooks for artists and designers.',
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900',
    },
  });

  const stationerySetsCategory = await prisma.category.create({
    data: {
      name: 'Stationery Sets',
      slug: 'stationery-sets',
      description: 'Complete sets for students and professionals.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900',
    },
  });

  console.log('✅ Created categories');

  // Create brand
  const pinakkBrand = await prisma.brand.create({
    data: {
      name: 'PINAKK',
      slug: 'pinakk',
      description: 'Premium stationery brand for creators and professionals.',
    },
  });
  console.log('✅ Created brand');

  // Create products
  const products = [
    {
      name: 'Signature Notebook',
      slug: 'signature-notebook',
      sku: 'PIN-NB-001',
      categoryId: notebookCategory.id,
      description: 'A premium A4 notebook designed for focused work and daily planning.',
      shortDescription: 'Premium A4 notebook for focused work',
      price: 149,
      stock: 120,
      images: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900',
      features: '200 ruled pages,Durable covers,Smooth paper finish',
      brandId: pinakkBrand.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Precision Gel Pen',
      slug: 'precision-gel-pen',
      sku: 'PIN-PEN-001',
      categoryId: pensCategory.id,
      description: 'A smooth-writing gel pen with a comfortable grip for long sessions.',
      shortDescription: 'Smooth-writing gel pen with comfortable grip',
      price: 49,
      stock: 240,
      images: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900',
      features: '0.7mm tip,Fast-drying ink,Ergonomic grip',
      brandId: pinakkBrand.id,
      isFeatured: true,
    },
    {
      name: 'Premium Sketchbook',
      slug: 'premium-sketchbook',
      sku: 'PIN-SK-001',
      categoryId: sketchbooksCategory.id,
      description: 'Professional-grade sketchbook with acid-free paper for artists.',
      shortDescription: 'Professional sketchbook with acid-free paper',
      price: 299,
      stock: 85,
      images: 'https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900',
      features: '100 sheets,Acid-free paper,Spiral binding',
      brandId: pinakkBrand.id,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Executive Ballpoint Pen',
      slug: 'executive-ballpoint-pen',
      sku: 'PIN-PEN-002',
      categoryId: pensCategory.id,
      description: 'Luxury ballpoint pen with metal finish and smooth ink flow.',
      shortDescription: 'Luxury ballpoint pen with metal finish',
      price: 199,
      stock: 150,
      images: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900',
      features: 'Metal body,Smooth ink,Premium finish',
      brandId: pinakkBrand.id,
      isBestSeller: true,
    },
    {
      name: 'Art Canvas Set',
      slug: 'art-canvas-set',
      sku: 'PIN-ART-001',
      categoryId: artSuppliesCategory.id,
      description: 'Professional canvas set for painting and artwork.',
      shortDescription: 'Professional canvas set for painting',
      price: 599,
      stock: 45,
      images: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900',
      features: '5 canvases,Stretched cotton,Primed surface',
      brandId: pinakkBrand.id,
      isFeatured: true,
    },
    {
      name: 'Brush Collection Set',
      slug: 'brush-collection-set',
      sku: 'PIN-ART-002',
      categoryId: artSuppliesCategory.id,
      description: 'Complete brush set for various painting techniques.',
      shortDescription: 'Complete brush set for various techniques',
      price: 449,
      stock: 60,
      images: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900',
      features: '12 brushes,Natural hair,Wooden handles',
      brandId: pinakkBrand.id,
    },
    {
      name: 'Desk Organizer',
      slug: 'desk-organizer',
      sku: 'PIN-DESK-001',
      categoryId: deskEssentialsCategory.id,
      description: 'Modern desk organizer for keeping your workspace tidy.',
      shortDescription: 'Modern desk organizer for tidy workspace',
      price: 349,
      stock: 90,
      images: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900',
      features: 'Multiple compartments,Wooden finish,Compact design',
      brandId: pinakkBrand.id,
      isFeatured: true,
    },
    {
      name: 'LED Desk Lamp',
      slug: 'led-desk-lamp',
      sku: 'PIN-DESK-002',
      categoryId: deskEssentialsCategory.id,
      description: 'Adjustable LED desk lamp with multiple brightness levels.',
      shortDescription: 'Adjustable LED desk lamp with brightness control',
      price: 599,
      stock: 70,
      images: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900',
      features: 'Touch control,USB charging,Flexible neck',
      brandId: pinakkBrand.id,
      isNewArrival: true,
    },
    {
      name: 'Watercolor Paint Set',
      slug: 'watercolor-paint-set',
      sku: 'PIN-ART-003',
      categoryId: artSuppliesCategory.id,
      description: 'Professional watercolor paint set with 24 vibrant colors.',
      shortDescription: 'Professional watercolor paint set with 24 colors',
      price: 399,
      stock: 55,
      images: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900',
      features: '24 colors,High pigment,Portable case',
      brandId: pinakkBrand.id,
      isBestSeller: true,
    },
    {
      name: 'Journal Notebook',
      slug: 'journal-notebook',
      sku: 'PIN-NB-002',
      categoryId: notebookCategory.id,
      description: 'Elegant journal notebook for daily reflections and planning.',
      shortDescription: 'Elegant journal for daily reflections',
      price: 249,
      stock: 100,
      images: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900',
      features: 'Leather cover,Lined pages,Bookmark ribbon',
      brandId: pinakkBrand.id,
      isFeatured: true,
    },
  ];

  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: product,
      })
    )
  );
  console.log('✅ Created products');

  // Create product variants for some products
  await prisma.productVariant.create({
    data: {
      productId: createdProducts[0].id,
      sku: 'PIN-NB-001-A4',
      size: 'A4',
      price: 149,
      mrp: 199,
      stock: 80,
    },
  });

  await prisma.productVariant.create({
    data: {
      productId: createdProducts[0].id,
      sku: 'PIN-NB-001-A5',
      size: 'A5',
      price: 99,
      mrp: 129,
      stock: 40,
    },
  });
  console.log('✅ Created product variants');

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minimumOrder: 500,
      maximumDiscount: 100,
      usageLimit: 1000,
      perUserLimit: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'FLAT50',
      discountType: 'FIXED',
      discountValue: 50,
      minimumOrder: 300,
      maximumDiscount: 50,
      usageLimit: 500,
      perUserLimit: 2,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    },
  });
  console.log('✅ Created coupons');

  // Create banners
  await prisma.banner.create({
    data: {
      title: 'Summer Sale',
      description: 'Up to 50% off on all stationery items',
      imageUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200',
      link: '/shop',
      position: 1,
      isActive: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'New Arrivals',
      description: 'Check out our latest collection',
      imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=1200',
      link: '/shop?sort=newest',
      position: 2,
      isActive: true,
    },
  });
  console.log('✅ Created banners');

  // Create settings
  await prisma.settings.create({
    data: {
      key: 'site_name',
      value: 'PINAKK',
      type: 'string',
    },
  });

  await prisma.settings.create({
    data: {
      key: 'currency',
      value: 'INR',
      type: 'string',
    },
  });

  await prisma.settings.create({
    data: {
      key: 'shipping_fee',
      value: '0',
      type: 'number',
    },
  });
  console.log('✅ Created settings');

  console.log('🎉 Database seeded successfully!');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@pinakk.com / admin123');
  console.log('   User: user@pinakk.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
