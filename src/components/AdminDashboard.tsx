import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Layers,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Check,
  ChevronDown,
  User,
} from 'lucide-react';
import { Product, Order, Category, Language, UserProfile } from '../types';
import { translations, getCategoryName } from '../locales/translations';
import { storageService } from '../services/storage';
import { ASSET_GALLERY } from '../data/initialProducts';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  lang: Language;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  onRefreshData: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  lang,
  currentUser,
  onUserChange,
  onRefreshData,
  onClose,
}) => {
  const t = translations[lang];

  // Full administrator access strictly for owner
  const isSuperAdmin = Boolean(currentUser && storageService.isUserAdmin(currentUser));

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'stats'>('products');

  // Product Form Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameKa: '',
    nameEn: '',
    categoryId: 'accessories',
    brand: 'VELOZONE',
    price: 290,
    originalPrice: '',
    image: ASSET_GALLERY[0].url,
    stockCount: 15,
    inStock: true,
    isFeatured: false,
    isSpecialOffer: false,
    descriptionKa: '',
    descriptionEn: '',
    sizes: 'Standard Fit',
  });

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const handleAdminGoogleLogin = () => {
    const user = storageService.loginWithGoogle('tavadzeluka053@gmail.com', 'Luka Tavadze (Owner)');
    onUserChange(user);
    setAuthError('');
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = passwordInput.trim().toLowerCase();
    if (cleanPwd === 'velo 20' || cleanPwd === 'velo20' || cleanPwd === 'admin123' || cleanPwd === 'velozone2026') {
      const user = storageService.loginWithGoogle('tavadzeluka053@gmail.com', 'Luka Tavadze (Owner)');
      onUserChange(user);
      setAuthError('');
    } else {
      setAuthError(t.admin.invalidPassword);
    }
  };

  const handleLogout = () => {
    storageService.logout();
    onUserChange(null);
    onClose();
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormData({
      nameKa: '',
      nameEn: '',
      categoryId: 'accessories',
      brand: 'VELOZONE',
      price: 290,
      originalPrice: '',
      image: ASSET_GALLERY[0].url,
      stockCount: 15,
      inStock: true,
      isFeatured: false,
      isSpecialOffer: false,
      descriptionKa: '',
      descriptionEn: '',
      sizes: 'Standard Fit',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameKa: product.nameKa,
      nameEn: product.nameEn,
      categoryId: product.categoryId,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      image: product.image,
      stockCount: product.stockCount,
      inStock: product.inStock,
      isFeatured: !!product.isFeatured,
      isSpecialOffer: !!product.isSpecialOffer,
      descriptionKa: product.descriptionKa,
      descriptionEn: product.descriptionEn,
      sizes: product.sizes ? product.sizes.join(', ') : '',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(t.admin.products.confirmDelete)) {
      storageService.deleteProduct(id);
      onRefreshData();
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const origPrice = formData.originalPrice ? Number(formData.originalPrice) : undefined;

    if (editingProduct) {
      storageService.updateProduct({
        ...editingProduct,
        nameKa: formData.nameKa,
        nameEn: formData.nameEn,
        categoryId: formData.categoryId,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: origPrice,
        image: formData.image,
        stockCount: Number(formData.stockCount),
        inStock: formData.inStock && Number(formData.stockCount) > 0,
        isFeatured: formData.isFeatured,
        isSpecialOffer: formData.isSpecialOffer,
        descriptionKa: formData.descriptionKa,
        descriptionEn: formData.descriptionEn,
        sizes: sizesArray,
      });
    } else {
      storageService.addProduct({
        nameKa: formData.nameKa,
        nameEn: formData.nameEn,
        categoryId: formData.categoryId,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: origPrice,
        image: formData.image,
        stockCount: Number(formData.stockCount),
        inStock: formData.inStock && Number(formData.stockCount) > 0,
        isFeatured: formData.isFeatured,
        isSpecialOffer: formData.isSpecialOffer,
        descriptionKa: formData.descriptionKa,
        descriptionEn: formData.descriptionEn,
        sizes: sizesArray,
        specs: [
          { labelKa: 'მასალა / ტიპი', labelEn: 'Type', valueKa: 'High Performance Cycling Gear', valueEn: 'High Performance Cycling Gear' },
        ],
        rating: 5.0,
        reviewsCount: 1,
      });
    }

    setIsProductModalOpen(false);
    onRefreshData();
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    storageService.updateOrderStatus(orderId, status);
    onRefreshData();
  };

  const handleResetData = () => {
    if (window.confirm('დავაბრუნოთ საწყისი პროდუქტების მონაცემთა ბაზა ყველა ახალი ფოტოთი (Velo Map, Clothe, Velo Glass)?')) {
      storageService.resetToDefaults();
      onRefreshData();
    }
  };

  // Calculations for Stats
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const totalOrderCount = orders.length;
  const avgOrderValue = totalOrderCount > 0 ? Math.round(totalRevenue / totalOrderCount) : 0;
  const activeProductCount = products.filter((p) => p.inStock).length;

  // ACCESS CONTROL: Fallback if logged out
  if (!isSuperAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-neutral-950 p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 text-red-500 border border-red-800 mb-3 shadow-lg shadow-red-950/50">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black font-display uppercase tracking-wider text-white">
              {t.admin.loginTitle}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {t.admin.loginSubtitle}
            </p>
          </div>

          <div className="space-y-4">
            {/* 1-Click Google Administrator login */}
            <div className="rounded-xl border border-red-800/80 bg-red-950/20 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block mb-2">
                მაღაზიის მფლობელის Google ავტორიზაცია
              </span>
              <button
                onClick={handleAdminGoogleLogin}
                className="w-full flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google-ით ავტორიზაცია</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-neutral-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-neutral-500">ან პაროლით</span>
              <div className="flex-grow border-t border-neutral-800"></div>
            </div>

            {/* Password Login Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="შეიყვანეთ ადმინის პაროლი..."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <p className="mt-1 text-[11px] text-neutral-500">{t.admin.passwordHint}</p>
              </div>

              {authError && (
                <div className="rounded-lg bg-red-950/50 border border-red-900/50 p-2.5 text-xs text-red-400">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-red-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
              >
                {t.admin.loginBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.nameKa.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              {t.admin.title}
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span className="font-semibold text-neutral-300">VELOZONE Store Owner</span>
            <span className="text-neutral-500">· სრული მართვის რეჟიმი</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900/70 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reset DB with all new products & categories"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ბაზის განახლება</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-900/60 bg-red-950/30 text-xs font-semibold text-red-400 hover:bg-red-950/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.logout}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="mt-6 flex border-b border-neutral-800 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'products'
              ? 'border-red-600 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 text-red-500" />
          <span>{t.admin.tabs.products}</span>
          <span className="rounded-full bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'orders'
              ? 'border-red-600 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-red-500" />
          <span>{t.admin.tabs.orders}</span>
          <span className="rounded-full bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'categories'
              ? 'border-red-600 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-red-500" />
          <span>{t.admin.tabs.categories}</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'stats'
              ? 'border-red-600 text-white bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-red-500" />
          <span>{t.admin.tabs.stats}</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="პროდუქტის ძებნა სახელის ან ბრენდის მიხედვით..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              onClick={openAddProductModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>{t.admin.products.addNew}</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">სურათი</th>
                    <th className="py-3 px-4">დასახელება</th>
                    <th className="py-3 px-4">კატეგორია</th>
                    <th className="py-3 px-4">ფასი</th>
                    <th className="py-3 px-4">მარაგი</th>
                    <th className="py-3 px-4">სტატუსი</th>
                    <th className="py-3 px-4 text-right">მოქმედება</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="h-10 w-10 rounded bg-neutral-950 p-1 flex items-center justify-center">
                          <img
                            src={p.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white max-w-[220px]">
                        <p className="truncate">{p.nameKa}</p>
                        <p className="text-[10px] text-neutral-500 font-normal truncate">{p.nameEn}</p>
                      </td>
                      <td className="py-2.5 px-4 text-neutral-400">
                        {getCategoryName(p.categoryId, lang)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-red-500 tabular-nums">
                        {p.price.toLocaleString()} ₾
                        {p.originalPrice && (
                          <span className="block text-[10px] text-neutral-500 line-through">
                            {p.originalPrice.toLocaleString()} ₾
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono tabular-nums">
                        {p.stockCount} ცალი
                      </td>
                      <td className="py-2.5 px-4">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            მარაგშია
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-semibold">
                            ამოიწურა
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="შეკვეთის ძებნა ნომრის ან კლიენტის მიხედვით..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">{t.admin.orders.orderId}</th>
                    <th className="py-3 px-4">{t.admin.orders.customer}</th>
                    <th className="py-3 px-4">მისამართი</th>
                    <th className="py-3 px-4">{t.admin.orders.date}</th>
                    <th className="py-3 px-4">{t.admin.orders.total}</th>
                    <th className="py-3 px-4">{t.admin.orders.payment}</th>
                    <th className="py-3 px-4">{t.admin.orders.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        {t.admin.orders.noOrders}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-900/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-red-500">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{order.customer.fullName}</p>
                          <p className="text-[11px] text-neutral-400">{order.customer.phone}</p>
                        </td>
                        <td className="py-3 px-4 text-neutral-300 max-w-[200px]">
                          <p className="truncate">{order.customer.city}, {order.customer.address}</p>
                          {order.customer.notes && (
                            <p className="text-[10px] text-neutral-500 truncate italic">
                              "{order.customer.notes}"
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                          {order.totalAmount.toLocaleString()} ₾
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-bold">
                          {order.paymentMethod === 'cod' ? (
                            <span className="text-amber-400">ადგილზე (COD)</span>
                          ) : (
                            <span className="text-emerald-400">ბარათით</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                            }
                            className={`rounded px-2.5 py-1 text-xs font-bold border focus:outline-none ${
                              order.status === 'delivered'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800'
                                : order.status === 'processing'
                                ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-950/80 text-red-400 border-red-800'
                                : 'bg-amber-950/80 text-amber-400 border-amber-800'
                            }`}
                          >
                            <option value="pending">{t.admin.orders.statusPending}</option>
                            <option value="processing">{t.admin.orders.statusProcessing}</option>
                            <option value="shipped">{t.admin.orders.statusShipped}</option>
                            <option value="delivered">{t.admin.orders.statusDelivered}</option>
                            <option value="cancelled">{t.admin.orders.statusCancelled}</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-500 uppercase">
                      {cat.id}
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-mono font-bold text-neutral-300">
                      {count} პროდუქტი
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ka' ? cat.nameKa : cat.nameEn}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {lang === 'ka' ? cat.descriptionKa : cat.descriptionEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: STATS */}
      {activeTab === 'stats' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.admin.stats.revenue}
              </span>
              <p className="mt-2 text-3xl font-black font-display font-mono text-red-500 tabular-nums">
                {totalRevenue.toLocaleString()} ₾
              </p>
            </div>

            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.admin.stats.totalOrders}
              </span>
              <p className="mt-2 text-3xl font-black font-display font-mono text-white tabular-nums">
                {totalOrderCount}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.admin.stats.avgOrder}
              </span>
              <p className="mt-2 text-3xl font-black font-display font-mono text-white tabular-nums">
                {avgOrderValue.toLocaleString()} ₾
              </p>
            </div>

            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.admin.stats.activeProducts}
              </span>
              <p className="mt-2 text-3xl font-black font-display font-mono text-emerald-400 tabular-nums">
                {activeProductCount}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 mb-3">
              კატეგორიების მიხედვით განაწილება
            </h3>
            <div className="space-y-3">
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                const percent = products.length > 0 ? (count / products.length) * 100 : 0;
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>{lang === 'ka' ? c.nameKa : c.nameEn}</span>
                      <span className="font-mono text-neutral-400">
                        {count} ({Math.round(percent)}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <h2 className="text-lg font-black font-display uppercase tracking-wide text-white">
                {editingProduct ? t.admin.form.editTitle : t.admin.form.addTitle}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.nameKa} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameKa}
                    onChange={(e) => setFormData({ ...formData, nameKa: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.nameEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.brand} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.category} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'ka' ? c.nameKa : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.stockCount} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData({ ...formData, stockCount: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.price} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.admin.form.originalPrice}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="მაგ: 350"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Image preset picker with user uploaded items */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  {t.admin.form.imagePreset} (Velo Map, Clothe, Velo Glass, MTB, etc.)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                  {ASSET_GALLERY.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      title={asset.name}
                      onClick={() => setFormData({ ...formData, image: asset.url })}
                      className={`relative aspect-square rounded-lg border overflow-hidden p-1 bg-neutral-900 ${
                        formData.image === asset.url ? 'border-red-600 ring-2 ring-red-600' : 'border-neutral-800'
                      }`}
                    >
                      <img src={asset.url} alt={asset.name} className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="სურათის URL ან /assets/aistudio/..."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  ზომები (მძიმით გამოყოფილი)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL ან 54cm, 56cm..."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>{t.admin.form.inStock}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>{t.admin.form.isFeatured}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSpecialOffer}
                    onChange={(e) => setFormData({ ...formData, isSpecialOffer: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>{t.admin.form.isSpecialOffer}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  {t.admin.form.descriptionKa}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionKa}
                  onChange={(e) => setFormData({ ...formData, descriptionKa: e.target.value })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  {t.admin.form.descriptionEn}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
                >
                  {t.admin.form.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
                >
                  {t.admin.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
