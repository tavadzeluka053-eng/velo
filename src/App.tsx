import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Bike,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Language,
  ActiveView,
  UserProfile,
} from './types';
import { translations, getCategoryName } from './locales/translations';
import { storageService } from './services/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Localization: Georgian by default
  const [lang, setLang] = useState<Language>('ka');
  const t = translations[lang];

  // Active Main View
  const [currentView, setCurrentView] = useState<ActiveView>('home');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    storageService.getCurrentUser()
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storageService.getWishlist());

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Shop Filters & Sort
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(14000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  // Check administrator privileges
  const isStoreAdmin = storageService.isUserAdmin(currentUser);

  // Persist cart & wishlist changes
  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storageService.saveWishlist(wishlist);
  }, [wishlist]);

  // Sync document language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Custom Event for Special Offers trigger
  useEffect(() => {
    const handleFilterOffers = () => {
      setSelectedCategory('all');
      setOnlyOffers(true);
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('velozone-filter-offers', handleFilterOffers);
    return () => window.removeEventListener('velozone-filter-offers', handleFilterOffers);
  }, []);

  // Data Refresh function for Admin changes
  const refreshAllData = () => {
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setOrders(storageService.getOrders());
  };

  // Cart handlers
  const handleAddToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedSize }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist handler
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filtered & Sorted products for Catalog
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        // Price Max
        if (p.price > priceMax) return false;
        // In stock
        if (inStockOnly && !p.inStock) return false;
        // Only special offers
        if (onlyOffers && !p.isSpecialOffer) return false;
        // Search
        if (catalogSearch.trim()) {
          const q = catalogSearch.toLowerCase();
          const match =
            p.nameKa.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.descriptionKa.toLowerCase().includes(q) ||
            p.descriptionEn.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured default
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, priceMax, inStockOnly, onlyOffers, catalogSearch, sortBy]);

  // Featured and Special Offer products for Homepage
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured).slice(0, 4);
  }, [products]);

  const specialOfferProducts = useMemo(() => {
    return products.filter((p) => p.isSpecialOffer).slice(0, 4);
  }, [products]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceMax(14000);
    setInStockOnly(false);
    setOnlyOffers(false);
    setCatalogSearch('');
    setSortBy('featured');
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* 1. Header (Strict Top Bar Contract - Admin panel completely hidden from regular users) */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'admin' && !isStoreAdmin) {
            setIsAuthOpen(true);
            return;
          }
          setCurrentView(view);
        }}
        lang={lang}
        setLang={setLang}
        cartCount={cartTotalItems}
        wishlistCount={wishlist.length}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        openAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW A: HOMEPAGE */}
        {currentView === 'home' && (
          <div>
            {/* 1. Hero Banner */}
            <Hero
              lang={lang}
              onShopNow={() => {
                setSelectedCategory('all');
                setOnlyOffers(false);
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2. Popular Categories Bar */}
            <CategoryBar
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lang={lang}
            />

            {/* 3. Featured Products Collection */}
            <section className="py-16 sm:py-24 bg-neutral-950">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                      VELOZONE PERFORMANCE
                    </span>
                    <h2 className="mt-1 text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
                      {lang === 'ka' ? 'რეკომენდებული მოდელები' : 'Featured Bicycles & Gear'}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
                  >
                    <span>{t.hero.exploreCatalog}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      lang={lang}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onViewDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Special Offers & Discounts Section */}
            {specialOfferProducts.length > 0 && (
              <section className="py-16 sm:py-20 bg-neutral-900/40 border-y border-neutral-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 border border-red-900/60 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.nav.offers}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
                        {lang === 'ka' ? 'სპეციალური შეთავაზებები' : 'Special Offers & Discounts'}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setOnlyOffers(true);
                        setCurrentView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
                    >
                      <span>{lang === 'ka' ? 'ყველა ფასდაკლება' : 'All Sale Items'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {specialOfferProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onViewDetails={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. Craftsmanship & Engineering Spotlight */}
            <section className="py-20 sm:py-28 bg-neutral-950">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                      RACE-PROVEN ENGINEERING
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
                      {lang === 'ka'
                        ? 'ინოვაცია ყოველ დეტალში'
                        : 'Precision Engineering in Every Detail'}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
                      {lang === 'ka'
                        ? 'VELOZONE აერთიანებს მსოფლიო აეროდინამიკურ კვლევებს, იაპონურ Torayca T1100 კარბონის ბოჭკოებს და უახლეს უკაბელო ელექტრონულ ტრანსმისიას. ჩვენი თითოეული ველოსიპედი აწყობილია უმაღლესი სიზუსტით.'
                        : 'VELOZONE unites wind-tunnel CFD aerodynamic modeling, Japanese Torayca T1100 carbon composite fibers, and wireless electronic drivetrains for supreme velocity.'}
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/70 text-red-500 border border-red-900/40">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {lang === 'ka' ? 'ულტრა-აეროდინამიკური გეომეტრია' : 'Aero-Integrated Monocoque'}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            ინტეგრირებული კაბელები და 22 ვატის ენერგიის ეკონომია 45 კმ/სთ სიჩქარეზე.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/70 text-red-500 border border-red-900/40">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {lang === 'ka' ? 'MIPS Air Node დაცვა' : 'Certified Structural Protection'}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            მბრუნავი დარტყმების შთანთქმის ტექნოლოგია მაქსიმალური უსაფრთხოებისთვის.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                    <img
                      src="/src/assets/images/product_road_race_1793606283895.jpg"
                      alt="Aero Carbon Geometry"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover rounded-xl"
                    />
                    <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-neutral-950/90 backdrop-blur-md p-4 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-500">
                          TOP PERFORMANCE
                        </span>
                        <p className="text-sm font-bold text-white">VELOZONE AERO VELOCE SLR</p>
                      </div>
                      <span className="font-mono text-base font-bold text-white">6.8 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW B: CATALOG / SHOP */}
        {currentView === 'shop' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                VELOZONE STORE
              </span>
              <h1 className="mt-1 text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
                {t.catalog.title}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400">
                {t.categories.subtitle}
              </p>
            </div>

            {/* Filter & Controls Bar */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6 mb-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder={t.catalog.searchPlaceholder}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Category select */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">{t.categories.all} ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'ka' ? c.nameKa : c.nameEn} (
                        {products.filter((p) => p.categoryId === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="featured">{t.catalog.sortFeatured}</option>
                    <option value="price-asc">{t.catalog.sortPriceAsc}</option>
                    <option value="price-desc">{t.catalog.sortPriceDesc}</option>
                    <option value="rating">{t.catalog.sortRating}</option>
                  </select>
                </div>

                {/* Reset button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.catalog.resetFilters}</span>
                  </button>
                </div>
              </div>

              {/* Quick toggles row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>{t.catalog.inStockOnly}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      checked={onlyOffers}
                      onChange={(e) => setOnlyOffers(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-400 font-semibold">{t.nav.offers}</span>
                  </label>
                </div>

                {/* Price Range Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400">{t.catalog.priceRange}:</span>
                  <input
                    type="range"
                    min="100"
                    max="14000"
                    step="100"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-32 accent-red-600"
                  />
                  <span className="font-mono font-bold text-white tabular-nums">
                    {priceMax.toLocaleString()} ₾
                  </span>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
              <span>
                {t.catalog.foundProducts}:{' '}
                <strong className="text-white font-mono">{filteredProducts.length}</strong>
              </span>
              {selectedCategory !== 'all' && (
                <span className="text-red-400 font-semibold">
                  {getCategoryName(selectedCategory, lang)}
                </span>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8">
                <Bike className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
                <h3 className="text-base font-bold text-neutral-200">{t.catalog.noProducts}</h3>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors"
                >
                  {t.catalog.resetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onViewDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW C: CHECKOUT */}
        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            lang={lang}
            onBackToShop={() => setCurrentView('shop')}
            onOrderSuccess={(order) => setConfirmedOrder(order)}
            onClearCart={handleClearCart}
          />
        )}

        {/* VIEW D: CONTACT / SHOWROOM */}
        {currentView === 'contact' && <ContactView lang={lang} />}

        {/* VIEW E: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            products={products}
            categories={categories}
            orders={orders}
            lang={lang}
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              storageService.setCurrentUser(user);
            }}
            onRefreshData={refreshAllData}
            onClose={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        isStoreAdmin={isStoreAdmin}
        onNavigate={(view) => {
          if (view === 'admin' && !isStoreAdmin) {
            setIsAuthOpen(true);
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCategoryClick={(catId) => {
          setSelectedCategory(catId);
          setCurrentView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lang={lang}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        lang={lang}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onViewDetails={(p) => setSelectedProduct(p)}
      />

      {/* Fast Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        lang={lang}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Order Confirmed Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        lang={lang}
        onGoHome={() => {
          setConfirmedOrder(null);
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal with Google Sign-in */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          storageService.setCurrentUser(user);
        }}
        lang={lang}
      />
    </div>
  );
}
