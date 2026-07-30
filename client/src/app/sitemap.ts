import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pinakk.com';
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Brand pages
  const brands = [
    'classmate', 'navneet', 'camlin', 'apsara', 'reynolds',
    'faber-castell', 'staedtler', 'pilot', 'cello', 'luxor',
    'casio', 'skybags', 'wildcraft', 'american-tourister', 'puma',
    'nike', 'milton', 'nataraj', 'doms', 'orpat',
    'texas-instruments', 'canon'
  ];

  const brandPages = brands.map(brand => ({
    url: `${baseUrl}/brands/${brand}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categories = [
    'Notebooks', 'Pens', 'Pencils', 'Erasers', 'Sharpeners',
    'Geometry Box', 'Art Supplies', 'Files & Folders', 'Diaries',
    'Calculator', 'School Bags', 'Water Bottles', 'Craft Supplies'
  ];

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...brandPages, ...categoryPages];
}
