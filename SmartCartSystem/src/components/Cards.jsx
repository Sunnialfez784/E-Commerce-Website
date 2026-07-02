import React from "react";
import {Link} from "react-router-dom";
import {Heart, Star} from "lucide-react";

const Cards = ({item, isProduct = false, isHome = false}) => {
  const price = Number(item.productPrice || 0);

  return (
    <div className="premium-card group flex flex-col bg-white">
      <Link to={`/details/${item.product_id}`} state={item} className="flex flex-1 flex-col">
        <div className="premium-card-media aspect-[4/3] p-4">
          <div className="absolute left-4 top-4 z-10 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-slate-900/20">Featured</div>

          <button type="button" onClick={(e) => e.preventDefault()} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/85 text-slate-500 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-rose-500" aria-label="Save to wishlist">
            <Heart className="h-4 w-4" />
          </button>

          <img src={item.productImage} alt={item.productName} className="relative h-full w-full object-contain transition duration-500 group-hover:scale-105" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              4.8 rating
            </div>
            <h1 className="text-[15px] font-semibold leading-6 text-slate-900 line-clamp-2">{item.productName}</h1>
            <p className="text-sm leading-6 text-slate-500 line-clamp-2">Premium product with a clean, conversion-focused layout.</p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-200 pt-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">From</p>
              <h2 className="text-xl font-bold tracking-tight text-slate-950">₹{price.toLocaleString("en-IN")}</h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition group-hover:-translate-y-0.5">
              View
              <span className="text-white/70">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Cards;
