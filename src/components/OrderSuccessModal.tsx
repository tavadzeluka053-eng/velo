import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, Home } from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../locales/translations';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  lang: Language;
  onGoHome: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  lang,
  onGoHome,
}) => {
  if (!order) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="text-center pb-6 border-b border-neutral-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">
            {t.orderSuccess.title}
          </h2>
          <p className="mt-2 text-xs text-neutral-400 max-w-md mx-auto">
            {t.orderSuccess.message}
          </p>
        </div>

        {/* Order Details Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 text-xs">
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[10px]">
                {t.orderSuccess.orderNumber}
              </span>
              <span className="font-mono font-bold text-red-500 text-sm">
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[10px]">
                {t.orderSuccess.date}
              </span>
              <span className="font-mono text-neutral-300">
                {order.date}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[10px]">
                {t.checkout.fullName}
              </span>
              <span className="text-neutral-200 font-semibold truncate block">
                {order.customer.fullName}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[10px]">
                {t.checkout.city}
              </span>
              <span className="text-neutral-200 truncate block">
                {order.customer.city}, {order.customer.address}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="border border-neutral-800/80 rounded-xl bg-neutral-900/30 p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              {t.orderSuccess.itemsList} ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-800/40 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded bg-neutral-950 p-0.5 shrink-0">
                    <img src={item.image} alt="" className="h-full w-full object-contain" />
                  </div>
                  <span className="text-neutral-200 truncate max-w-[200px]">
                    {lang === 'ka' ? item.nameKa : item.nameEn}
                    {item.size ? ` (${item.size})` : ''}
                  </span>
                </div>
                <div className="font-mono text-neutral-300 tabular-nums shrink-0">
                  {item.quantity} x {item.price.toLocaleString()} ₾
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
              <span>{t.cart.total}</span>
              <span className="font-mono text-lg text-red-500 tabular-nums">
                {order.totalAmount.toLocaleString()} ₾
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-900 text-neutral-400 text-xs">
            <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>სტატუსი: <strong>მუშავდება</strong> · კურიერი დაგიკავშირდებათ 30 წუთით ადრე</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-800 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onGoHome();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t.orderSuccess.backToHome}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
          >
            <span>{t.orderSuccess.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
