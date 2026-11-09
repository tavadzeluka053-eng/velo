import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Star, Check } from 'lucide-react';
import { Product, Language } from '../types';
import { translations, getCategoryName } from '../locales/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  lang,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const t = translations[lang];
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isAdded, setIsAdded] = useState(false);
  const [modalImg, setModalImg] = useState(product.image);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Visual Showcase */}
          <div className="relative flex items-center justify-center bg-neutral-900/60 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-neutral-800">
            <img
              src={modalImg}
              alt={lang === 'ka' ? product.nameKa : product.nameEn}
              referrerPolicy="no-referrer"
              onError={() => {
                if (modalImg.startsWith('/assets/')) {
                  setModalImg('/public' + modalImg);
                }
              }}
              className="max-h-[380px] w-full object-contain"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4 rounded bg-red-600 px-2.5 py-1 text-xs font-bold uppercase text-white shadow-md">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-bold uppercase tracking-wider text-red-500">
                  {getCategoryName(product.categoryId, lang)}
                </span>
                <span className="font-medium text-neutral-400">{product.brand}</span>
              </div>

              {/* Title */}
              <h2 className="mt-2 text-2xl font-black font-display uppercase tracking-tight text-white">
                {lang === 'ka' ? product.nameKa : product.nameEn}
              </h2>

              {/* Rating & Reviews */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono tabular-nums text-neutral-300">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-500">
                  ({product.reviewsCount} {t.product.reviews})
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black font-display text-white font-mono tabular-nums">
                  {product.price.toLocaleString()} ₾
                </span>
                {product.originalPrice && (
                  <span className="text-base text-neutral-500 line-through font-mono tabular-nums">
                    {product.originalPrice.toLocaleString()} ₾
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {t.product.inStock} ({product.stockCount} {t.product.pieces})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {t.product.outOfStock}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                {lang === 'ka' ? product.descriptionKa : product.descriptionEn}
              </p>

              {/* Frame Size Selection if applicable */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {t.product.frameSize}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-red-600 text-white border-red-500 shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Actions */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/80">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                    className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-bold uppercase tracking-wider transition-all ${
                    product.inStock
                      ? isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-lg shadow-red-950/40'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.product.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.product.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Technical Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-6 border-t border-neutral-800 pt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
                    {t.product.specifications}
                  </h4>
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
                        <dt className="text-neutral-400 font-medium">
                          {lang === 'ka' ? spec.labelKa : spec.labelEn}
                        </dt>
                        <dd className="text-neutral-200 font-semibold mt-0.5">
                          {lang === 'ka' ? spec.valueKa : spec.valueEn}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Trust Mini-Bar */}
            <div className="border-t border-neutral-800 pt-4 grid grid-cols-3 gap-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{t.product.deliveryInfo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{t.hero.warranty}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>14 დღე დაბრუნება</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
