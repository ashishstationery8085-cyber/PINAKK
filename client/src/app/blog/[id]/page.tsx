import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

const blogPosts: Record<string, any> = {
  '1': {
    title: 'Top 10 Stationery Essentials for Students',
    excerpt: 'Discover the must-have stationery items every student needs for a successful academic year.',
    date: 'July 10, 2024',
    category: 'Stationery',
    image: '📝',
    author: 'PINAKK Team',
    content: `
      <p>Starting a new academic year can be both exciting and overwhelming. Having the right stationery essentials can make a significant difference in your learning experience. Here are our top 10 picks:</p>
      
      <h3>1. Quality Notebooks</h3>
      <p>Invest in good-quality notebooks that can withstand daily use. Classmate and Navneet offer excellent options with durable paper.</p>
      
      <h3>2. Smooth Writing Pens</h3>
      <p>A reliable pen is crucial. Reynolds and Parker pens are known for their smooth ink flow and comfortable grip.</p>
      
      <h3>3. Highlighters</h3>
      <p>Color-coded highlighting helps in effective studying. Choose from brands like Camlin for vibrant, smudge-proof options.</p>
      
      <h3>4. Geometry Box</h3>
      <p>Essential for math and science students. A complete geometry box with compass, protractor, and set squares is a must-have.</p>
      
      <h3>5. Erasers and Sharpeners</h3>
      <p>Keep your work neat with quality erasers from Apsara and reliable sharpeners.</p>
      
      <h3>6. Files and Folders</h3>
      <p>Stay organized with proper file management. Use different colored folders for different subjects.</p>
      
      <h3>7. Calculator</h3>
      <p>A scientific calculator is essential for higher studies. Casio offers reliable options.</p>
      
      <h3>8. Sticky Notes</h3>
      <p>Perfect for quick reminders and bookmarking important pages.</p>
      
      <h3>9. Desk Organizer</h3>
      <p>Keep your study space tidy with a desk organizer for all your essentials.</p>
      
      <h3>10. Art Supplies</h3>
      <p>For creative projects, keep basic art supplies like colored pencils, sketch pens, and watercolors handy.</p>
      
      <p>Having these essentials will set you up for a successful academic year. Visit our store to explore these products and more!</p>
    `
  },
  '2': {
    title: 'How to Organize Your Office Desk',
    excerpt: 'Tips and tricks to create a productive and organized workspace that boosts efficiency.',
    date: 'July 5, 2024',
    category: 'Office',
    image: '📊',
    author: 'PINAKK Team',
    content: `
      <p>An organized desk is the foundation of productivity. A clutter-free workspace not only looks professional but also helps you focus better. Here are some practical tips:</p>
      
      <h3>Start with a Clean Slate</h3>
      <p>Remove everything from your desk and clean the surface. This gives you a fresh start and helps you decide what really belongs on your desk.</p>
      
      <h3>Categorize Your Items</h3>
      <p>Group items into categories: frequently used, occasionally used, and rarely used. Keep only frequently used items on your desk.</p>
      
      <h3>Use Desk Organizers</h3>
      <p>Invest in quality desk organizers for pens, papers, and other supplies. This keeps everything accessible yet neat.</p>
      
      <h3>Cable Management</h3>
      <p>Use cable ties and organizers to keep wires tidy. This not only looks better but also prevents accidents.</p>
      
      <h3>Label Everything</h3>
      <p>Label files, folders, and storage boxes. This saves time when you need to find something quickly.</p>
      
      <h3>Digital Organization</h3>
      <p>Don't forget your digital workspace. Organize your computer files and desktop icons for a seamless workflow.</p>
      
      <h3>Maintain Daily</h3>
      <p>Spend 5 minutes at the end of each day tidying up. This prevents clutter from building up.</p>
      
      <p>A well-organized desk can significantly boost your productivity and reduce stress. Start implementing these tips today!</p>
    `
  },
  '3': {
    title: 'Sustainable Stationery Choices',
    excerpt: 'Learn about eco-friendly stationery options that help reduce your environmental footprint.',
    date: 'June 28, 2024',
    category: 'Environment',
    image: '🌱',
    author: 'PINAKK Team',
    content: `
      <p>Making sustainable choices in our daily lives, including the stationery we use, can have a significant positive impact on the environment. Here are some eco-friendly options:</p>
      
      <h3>Recycled Paper Products</h3>
      <p>Choose notebooks and paper made from recycled materials. Many brands now offer high-quality recycled paper options.</p>
      
      <h3>Refillable Pens</h3>
      <p>Instead of disposable pens, opt for refillable ones. This reduces plastic waste significantly over time.</p>
      
      <h3>Bamboo Stationery</h3>
      <p>Bamboo is a sustainable material. Look for bamboo rulers, pen holders, and even bamboo-based paper products.</p>
      
      <h3>Plantable Pencils</h3>
      <p>These innovative pencils contain seeds at the bottom. When they're too short to use, plant them to grow herbs or flowers.</p>
      
      <h3>Eco-Friendly Erasers</h3>
      <p>Choose erasers made from natural rubber or recycled materials instead of synthetic ones.</p>
      
      <h3>Non-Toxic Art Supplies</h3>
      <p>For art projects, opt for water-based paints and non-toxic markers that are safer for both users and the environment.</p>
      
      <h3>Minimal Packaging</h3>
      <p>Support brands that use minimal or recycled packaging for their products.</p>
      
      <p>Every small change contributes to a larger impact. By choosing sustainable stationery, you're helping create a greener future.</p>
    `
  }
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts[params.id];

  if (!post) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Blog Post Not Found</h1>
          <Link href="/blog" className="mt-4 inline-block text-secondary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8">
        <FiArrowLeft /> Back to Blog
      </Link>

      <article className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-8xl mb-8">
          {post.image}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <FiCalendar /> {post.date}
          </span>
          <span className="flex items-center gap-2">
            <FiUser /> {post.author}
          </span>
          <span className="flex items-center gap-2">
            <FiTag /> {post.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-6">{post.title}</h1>

        <div 
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/blog" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
