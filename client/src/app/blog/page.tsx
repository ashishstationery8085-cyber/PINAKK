import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Stationery Essentials for Students',
    excerpt: 'Discover the must-have stationery items every student needs for a successful academic year.',
    date: 'July 10, 2024',
    category: 'Stationery',
    image: '📝'
  },
  {
    id: 2,
    title: 'How to Organize Your Office Desk',
    excerpt: 'Tips and tricks to create a productive and organized workspace that boosts efficiency.',
    date: 'July 5, 2024',
    category: 'Office',
    image: '📊'
  },
  {
    id: 3,
    title: 'Sustainable Stationery Choices',
    excerpt: 'Learn about eco-friendly stationery options that help reduce your environmental footprint.',
    date: 'June 28, 2024',
    category: 'Environment',
    image: '🌱'
  },
  {
    id: 4,
    title: 'Best Notebooks for Creative Writing',
    excerpt: 'Explore our top picks for notebooks that inspire creativity and perfect for writers.',
    date: 'June 20, 2024',
    category: 'Stationery',
    image: '📓'
  },
  {
    id: 5,
    title: 'Art Supplies for Beginners',
    excerpt: 'A comprehensive guide to essential art supplies for anyone starting their creative journey.',
    date: 'June 15, 2024',
    category: 'Art',
    image: '🎨'
  },
  {
    id: 6,
    title: 'Office Organization Hacks',
    excerpt: 'Transform your workspace with these simple yet effective organization tips.',
    date: 'June 10, 2024',
    category: 'Office',
    image: '🗂️'
  }
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900">Our Blog</h1>
        <p className="mt-4 text-lg text-slate-600">Tips, guides, and insights about stationery, office supplies, and productivity.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="group">
            <article className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-7xl mb-6">
                {post.image}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{post.category}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-primary transition">{post.title}</h2>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-secondary group-hover:underline">
                Read More →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
