import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CartItem, Language, CustomerDetails, Order } from '../types';
import { translations } from '../locales/translations';
import { storageService } from '../services/storage';

interface CheckoutViewProps {
  cart: CartItem[];
  lang: Language;
  onBackToShop: () => void;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  lang,
  onBackToShop,
  onOrderSuccess,
  onClearCart,
}) => {
  const t = translations[lang];

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    city: 'თბილისი',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shippingFee = 0; // Free delivery across Georgia
  const totalAmount = subtotal + shippingFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = t.checkout.requiredField;
    if (!customer.phone.trim()) errs.phone = t.checkout.requiredField;
    if (!customer.address.trim()) errs.address = t.checkout.requiredField;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        nameKa: item.product.nameKa,
        nameEn: item.product.nameEn,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        size: item.selectedSize,
      }));

      const newOrder = storageService.createOrder({
        customer,
        items: orderItems,
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod,
      });

      onClearCart();
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold font-display text-white mb-2">{t.cart.empty}</h2>
        <p className="text-sm text-neutral-400 mb-6">{t.cart.emptySub}</p>
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.cart.startShopping}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.cart.startShopping}</span>
      </button>

      <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white mb-8">
        {t.checkout.title}
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Details */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold">1</span>
              {t.checkout.contactInfo}
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  {t.checkout.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className={`w-full rounded-lg border bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    errors.fullName ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    {t.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder={t.checkout.phonePlaceholder}
                    className={`w-full rounded-lg border bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.phone ? 'border-red-500' : 'border-neutral-800'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    {t.checkout.email}
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder={t.checkout.emailPlaceholder}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold">2</span>
              {t.checkout.deliveryAddress}
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  {t.checkout.city}
                </label>
                <select
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="თბილისი">თბილისი (Tbilisi)</option>
                  <option value="ბათუმი">ბათუმი (Batumi)</option>
                  <option value="ქუთაისი">ქუთაისი (Kutaisi)</option>
                  <option value="რუსთავი">რუსთავი (Rustavi)</option>
                  <option value="თელავი">თელავი (Telavi)</option>
                  <option value="გორი">გორი (Gori)</option>
                  <option value="ზუგდიდი">ზუგდიდი (Zugdidi)</option>
                  <option value="ფოთი">ფოთი (Poti)</option>
                  <option value="სხვა რეგიონი">სხვა რეგიონი (Other Region)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  {t.checkout.address} *
                </label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder={t.checkout.addressPlaceholder}
                  className={`w-full rounded-lg border bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    errors.address ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  {t.checkout.notes}
                </label>
                <textarea
                  rows={2}
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder={t.checkout.notesPlaceholder}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold">3</span>
              {t.checkout.paymentMethod}
            </h2>

            <div className="space-y-3 pt-2">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-red-600 bg-red-950/20'
                    : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-white">{t.checkout.cod}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">{t.checkout.codDesc}</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-red-600 bg-red-950/20'
                    : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-white">{t.checkout.card}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">{t.checkout.cardDesc}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-neutral-800 pb-3">
              {t.checkout.orderSummary} ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            {/* Itemized List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-neutral-800/50 last:border-0">
                  <div className="h-14 w-14 rounded-lg bg-neutral-950 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.nameKa}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {lang === 'ka' ? item.product.nameKa : item.product.nameEn}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {item.quantity} x {item.product.price.toLocaleString()} ₾
                      {item.selectedSize && ` · ${item.selectedSize}`}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-white tabular-nums">
                    {(item.product.price * item.quantity).toLocaleString()} ₾
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-neutral-800 pt-4 space-y-2.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono text-neutral-200 tabular-nums">
                  {subtotal.toLocaleString()} ₾
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span className="text-emerald-400 font-semibold">{t.cart.free}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                <span>{t.cart.total}</span>
                <span className="font-mono text-2xl text-red-500 tabular-nums">
                  {totalAmount.toLocaleString()} ₾
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-red-950/60 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{t.checkout.processing}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.checkout.placeOrder}</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSL 256-Bit ენკრიპცია & ოფიციალური გარანტია</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
