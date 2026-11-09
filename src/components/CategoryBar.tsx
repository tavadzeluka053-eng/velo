import React from 'react';
import {
  Mountain,
  Compass,
  Zap,
  BatteryCharging,
  Smile,
  Shield,
  Sliders,
  Wrench,
  Grid,
  Glasses,
  Shirt,
} from 'lucide-react';
import { Category, Language } from '../types';
import { translations } from '../locales/translations';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  lang: Language;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  lang,
}) => {
  const t = translations[lang];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain':
        return <Mountain className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5" />;
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Glasses':
        return <Glasses className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Grid className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
              {t.categories.title}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {t.categories.subtitle}
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategoryId === 'all'
                ? 'text-red-500 underline underline-offset-4'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.categories.all} ({categories.length})
          </button>
        </div>

        {/* Categories Grid - Responsive 2 to 5 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {/* All button */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center group ${
              selectedCategoryId === 'all'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/40'
                : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-2 transition-transform group-hover:scale-110 ${
                selectedCategoryId === 'all' ? 'bg-black/20 text-white' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.categories.all}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center group ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/40'
                    : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mb-2 transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-neutral-800 text-neutral-300 group-hover:text-red-500'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-2">
                  {lang === 'ka' ? cat.nameKa : cat.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
