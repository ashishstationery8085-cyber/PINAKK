import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  discount?: number;
  oldPrice?: number;
  image?: string;
  description?: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      {product.discount ? (
        <span className="absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-white shadow-lg">
          -{product.discount}%
        </span>
      ) : null}

      <div className="relative w-full overflow-hidden rounded-xl bg-slate-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-44 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-44 w-full bg-slate-100" />
        )}
      </div>

      <div className="mt-4 flex-1">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{product.category}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
        {product.description ? <p className="mt-2 text-sm text-slate-600 line-clamp-2">{product.description}</p> : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">₹{product.price}</p>
          {product.oldPrice ? <p className="text-sm text-slate-500 line-through">₹{product.oldPrice}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-950">
            View
          </Link>
          <Link href={`/products/${product.id}`} aria-label={`Add ${product.name} to cart`} className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
            <FiShoppingCart />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
