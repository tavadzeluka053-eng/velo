import React, { useState } from 'react';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { translations, getCategoryName } from '../locales/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  lang: Language;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  lang,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.nameKa.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.descriptionKa.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-800 pb-4">
          <SearchIcon className="w-5 h-5 text-red-500 absolute left-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            autoFocus
            className="w-full bg-transparent pl-10 pr-10 text-base font-medium text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-500 hover:text-white p-1 absolute right-8"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              შეიყვანეთ მოდელის სახელი, მაგალითად: <span className="text-red-400">Aero</span>, <span className="text-red-400">Enduro</span>, <span className="text-red-400">Helmet</span>...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-400">
              {t.catalog.noProducts}
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onClose();
                  onSelectProduct(prod);
                }}
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-800/60 bg-neutral-900/40 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-neutral-900 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.nameKa}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-red-500">
                      {getCategoryName(prod.categoryId, lang)}
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {lang === 'ka' ? prod.nameKa : prod.nameEn}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-sm font-bold text-white tabular-nums">
                    {prod.price.toLocaleString()} ₾
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
