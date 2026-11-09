import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../locales/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lang: Language;
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white">
                {t.cart.title}
              </h2>
              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-mono font-bold text-neutral-300">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="h-16 w-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-200">{t.cart.empty}</h3>
                <p className="mt-1 text-xs text-neutral-500 max-w-xs">{t.cart.emptySub}</p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-lg bg-neutral-900 border border-neutral-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || index}`}
                  className="flex gap-4 p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 relative group"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-900 p-2 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.nameKa}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {lang === 'ka' ? item.product.nameKa : item.product.nameEn}
                        </h4>
                      </div>
                      {item.selectedSize && (
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {t.product.frameSize}: {item.selectedSize}
                        </span>
                      )}
                      <span className="font-mono text-sm font-bold text-red-500 tabular-nums block mt-1">
                        {(item.product.price * item.quantity).toLocaleString()} ₾
                      </span>
                    </div>

                    {/* Steppers */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60">
                      <div className="flex items-center rounded border border-neutral-800 bg-neutral-950">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize
                            )
                          }
                          className="px-2 py-1 text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize
                            )
                          }
                          className="px-2 py-1 text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.selectedSize)
                        }
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        title={t.cart.remove}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono text-sm text-neutral-200 tabular-nums">
                  {subtotal.toLocaleString()} ₾
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>{t.cart.shipping}</span>
                <span className="text-emerald-400 font-semibold">{t.cart.free}</span>
              </div>

              <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                <span>{t.cart.total}</span>
                <span className="font-mono text-xl text-red-500 tabular-nums">
                  {subtotal.toLocaleString()} ₾
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClearCart}
                  className="px-3 py-3 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors text-xs font-semibold"
                  title={t.cart.clear}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-950/50"
                >
                  <span>{t.cart.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
