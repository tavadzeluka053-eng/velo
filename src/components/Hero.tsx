import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Percent } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { HERO_IMAGE } from '../data/initialProducts';

interface HeroProps {
  lang: Language;
  onShopNow: () => void;
  onExploreCategory: (catId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onShopNow, onExploreCategory }) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="VELOZONE Pro Cycling Mountain Road"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark gradient scrim for 4.5:1 WCAG legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          {/* Brand Tagline */}
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-red-500 uppercase">
            <span>VELOZONE</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{t.brand.slogan}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase text-balance leading-none">
            {t.hero.headline}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xl sm:text-2xl font-bold text-neutral-200">
            {t.hero.subtitle}
          </p>

          {/* Body Description */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300 max-w-xl">
            {t.hero.description}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onShopNow}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-red-950/50 hover:bg-red-700 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>{t.hero.shopNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreCategory('road')}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-700/80 bg-neutral-900/60 px-6 py-4 text-sm font-semibold text-neutral-200 hover:text-white hover:border-neutral-500 hover:bg-neutral-800/80 transition-all whitespace-nowrap backdrop-blur-sm"
            >
              {t.hero.exploreCatalog}
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="relative z-10 border-y border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/60 text-red-500 border border-red-900/40">
                <Truck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-neutral-100">{t.hero.freeDelivery}</p>
                <p className="text-neutral-400">1-3 სამუშაო დღეში</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/60 text-red-500 border border-red-900/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-neutral-100">{t.hero.warranty}</p>
                <p className="text-neutral-400">ავტორიზებული სერვის ცენტრი</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/60 text-red-500 border border-red-900/40">
                <Percent className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-neutral-100">{t.hero.installment}</p>
                <p className="text-neutral-400">TBC / BoG ონლაინ დამტკიცება</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
