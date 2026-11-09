import React, { useState } from 'react';
import { Mail, Check, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Language, ActiveView } from '../types';
import { translations } from '../locales/translations';

interface FooterProps {
  lang: Language;
  onNavigate: (view: ActiveView) => void;
  onCategoryClick: (categoryId: string) => void;
  isStoreAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, onCategoryClick, isStoreAdmin }) => {
  const t = translations[lang];
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-neutral-900 bg-black text-neutral-400">
      {/* Newsletter Strip */}
      <div className="border-b border-neutral-900 bg-neutral-950/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-black uppercase tracking-wider text-white">
                {t.footer.newsletterTitle}
              </h3>
              <p className="mt-1 text-xs text-neutral-400 max-w-md">
                {t.footer.newsletterSub}
              </p>
            </div>

            {isSubscribed ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-950/80 border border-emerald-800 px-4 py-2.5 text-xs font-semibold text-emerald-300">
                <Check className="w-4 h-4" />
                <span>{t.footer.subscribeSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md w-full gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="თქვენი ელ-ფოსტა..."
                  className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors whitespace-nowrap shadow-lg shadow-red-950/40"
                >
                  {t.footer.subscribe}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5 font-display text-2xl font-black tracking-wider text-white">
              <span>VELO</span>
              <span className="text-red-600">ZONE</span>
            </div>
            <p className="text-xs font-bold tracking-widest text-red-500 uppercase">
              {t.brand.slogan}
            </p>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              {t.footer.aboutText}
            </p>
            <div className="space-y-1.5 pt-2 text-xs">
              <p className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{t.contact.addressValue}</span>
              </p>
              <p className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{t.contact.phoneValue}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.footer.fastLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.catalog}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('shop');
                    window.dispatchEvent(new CustomEvent('velozone-filter-offers'));
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.offers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.nav.categories}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onCategoryClick('mtb')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t.categories.mtb}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('road')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t.categories.road}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('ebike')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t.categories.ebike}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('helmets')}
                  className="hover:text-white transition-colors text-left"
                >
                  {t.categories.helmets}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>{t.hero.freeDelivery}</li>
              <li>{t.hero.warranty}</li>
              <li>{t.hero.installment}</li>
              {isStoreAdmin && (
                <li className="pt-2">
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.nav.admin}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} VELOZONE. {t.footer.rights}</p>
          <p className="flex items-center gap-2">
            <span>საქართველო · თბილისი</span>
            <span>·</span>
            <span>RIDE THE CHANGE</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
