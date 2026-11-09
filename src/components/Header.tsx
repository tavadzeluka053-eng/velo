import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, Menu, X, Globe, User, LogIn } from 'lucide-react';
import { Language, ActiveView, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { storageService } from '../services/storage';

interface HeaderProps {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openWishlist: () => void;
  openSearch: () => void;
  currentUser: UserProfile | null;
  openAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  lang,
  setLang,
  cartCount,
  wishlistCount,
  openCart,
  openWishlist,
  openSearch,
  currentUser,
  openAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  // Administrator access strictly for the store owner
  const isStoreAdmin = Boolean(currentUser && storageService.isUserAdmin(currentUser));

  const handleNavClick = (view: ActiveView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang(lang === 'ka' ? 'en' : 'ka');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-1.5 text-left font-display text-2xl font-black tracking-wider text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <span>VELO</span>
          <span className="text-red-600">ZONE</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'home' ? 'text-red-500 font-semibold' : ''
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'shop' ? 'text-red-500 font-semibold' : ''
            }`}
          >
            {t.nav.catalog}
          </button>
          <button
            onClick={() => {
              handleNavClick('shop');
              window.dispatchEvent(new CustomEvent('velozone-filter-offers'));
            }}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-white"
          >
            {t.nav.offers}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'contact' ? 'text-red-500 font-semibold' : ''
            }`}
          >
            {t.nav.contact}
          </button>
        </nav>

        {/* Zone 3: Actions & utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 bg-neutral-900/60 transition-colors whitespace-nowrap"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={openWishlist}
            className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-lg shadow-red-950/40"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">{t.cart.title}</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/40 px-1 text-[11px] font-bold tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* User / Google Auth Button */}
          <button
            onClick={openAuth}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
            title={currentUser ? currentUser.email : t.auth.signIn}
          >
            {currentUser ? (
              <>
                <User className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline max-w-[100px] truncate">{currentUser.fullName}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline">{t.auth.signIn}</span>
              </>
            )}
          </button>

          {/* Admin quick access button */}
          {isStoreAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${
                currentView === 'admin'
                  ? 'border-red-600 text-white bg-red-600 shadow-md shadow-red-950/60'
                  : 'border-red-700 bg-red-950/40 text-red-400 hover:bg-red-900/40'
              }`}
              title="VELOZONE Store Owner Administration"
            >
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium text-neutral-200">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 hover:text-red-500 transition-colors ${
                currentView === 'home' ? 'text-red-500 font-bold' : ''
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-left py-2 hover:text-red-500 transition-colors ${
                currentView === 'shop' ? 'text-red-500 font-bold' : ''
              }`}
            >
              {t.nav.catalog}
            </button>
            <button
              onClick={() => {
                handleNavClick('shop');
                window.dispatchEvent(new CustomEvent('velozone-filter-offers'));
              }}
              className="text-left py-2 hover:text-red-500 transition-colors"
            >
              {t.nav.offers}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2 hover:text-red-500 transition-colors ${
                currentView === 'contact' ? 'text-red-500 font-bold' : ''
              }`}
            >
              {t.nav.contact}
            </button>

            {/* Profile / Sign In in Mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuth();
              }}
              className="text-left py-2 flex items-center gap-2 hover:text-red-500 transition-colors border-t border-neutral-900 pt-3"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>{currentUser ? currentUser.fullName : t.auth.signIn}</span>
            </button>

            {/* Admin link */}
            {isStoreAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`text-left py-2 flex items-center gap-2 text-red-500 font-bold transition-colors ${
                  currentView === 'admin' ? 'underline' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.nav.admin}</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
