import Link from 'next/link';

type Props = {
  title: string;
  description: string;
  href: string;
};

const CategoryCard = ({ title, description, href }: Props) => {
  return (
    <Link href={href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Category</p>
      <h3 className="mt-4 text-2xl font-semibold text-slate-900 group-hover:text-primary">{title}</h3>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
      <span className="mt-4 inline-flex text-sm font-semibold text-secondary">Shop now →</span>
    </Link>
  );
};

export default CategoryCard;
