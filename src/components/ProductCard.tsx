import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, Language } from '../types';
import { translations, getCategoryName } from '../locales/translations';

interface ProductCardProps {
  product: Product;
  lang: Language;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
}) => {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const t = translations[lang];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950/70 p-4 flex items-center justify-center">
        {!imageError ? (
          <img
            src={imgSrc}
            alt={lang === 'ka' ? product.nameKa : product.nameEn}
            referrerPolicy="no-referrer"
            onError={() => {
              if (imgSrc.startsWith('/assets/')) {
                setImgSrc('/public' + imgSrc);
              } else {
                setImageError(true);
              }
            }}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-neutral-900 text-neutral-500">
            <span className="text-xs font-semibold">{product.brand}</span>
            <span className="text-[11px] mt-1 text-neutral-600">VELOZONE</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && !discountPercent && (
            <span className="rounded bg-neutral-800/90 border border-neutral-700 px-2 py-0.5 text-[11px] font-semibold text-neutral-200">
              {t.product.featuredBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
            isWishlisted
              ? 'border-red-600 bg-red-600 text-white'
              : 'border-neutral-700/80 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 border border-neutral-800 px-3 py-1 rounded bg-black/60">
              {t.product.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-red-500/90 text-[11px]">
              {getCategoryName(product.categoryId, lang)}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-mono text-xs tabular-nums text-neutral-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-display text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {lang === 'ka' ? product.nameKa : product.nameEn}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {lang === 'ka' ? product.descriptionKa : product.descriptionEn}
          </p>
        </div>

        {/* Pricing and Action row */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-white font-mono tabular-nums">
                {product.price.toLocaleString()} ₾
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through font-mono tabular-nums">
                  {product.originalPrice.toLocaleString()} ₾
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-400/90 font-medium block">
              {product.inStock ? t.product.inStock : t.product.outOfStock}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="p-2 rounded-lg bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              title={t.product.viewDetails}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              disabled={!product.inStock}
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                product.inStock
                  ? isAdding
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAdding ? t.product.addedToCart : t.product.addToCart}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
