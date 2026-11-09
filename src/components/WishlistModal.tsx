import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../locales/translations';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  lang: Language;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  lang,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white">
              {t.wishlist.title}
            </h2>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-mono font-bold text-neutral-300">
              {wishlistedProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Heart className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
              <p className="text-sm font-semibold text-neutral-300">{t.wishlist.empty}</p>
              <p className="text-xs text-neutral-500 mt-1">{t.wishlist.emptySub}</p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 transition-colors"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                >
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-neutral-900 p-1 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.nameKa}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {lang === 'ka' ? product.nameKa : product.nameEn}
                    </h4>
                    <p className="font-mono text-xs font-bold text-red-500 tabular-nums mt-0.5">
                      {product.price.toLocaleString()} ₾
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={!product.inStock}
                    onClick={() => onAddToCart(product)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.product.addToCart}</span>
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
