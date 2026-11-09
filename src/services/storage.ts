import { Product, Order, CartItem, Category, UserProfile } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';

const PRODUCTS_KEY = 'velozone_products_v2';
const CATEGORIES_KEY = 'velozone_categories_v2';
const ORDERS_KEY = 'velozone_orders_v2';
const CART_KEY = 'velozone_cart_v2';
const WISHLIST_KEY = 'velozone_wishlist_v2';
const CURRENT_USER_KEY = 'velozone_current_user_v4';

export const storageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const parsed = JSON.parse(data);
      // If parsed list doesn't have the new velo map product, refresh to include all new items
      const hasVeloMap = parsed.some((p: Product) => p.id === 'vz-acc-map-01');
      if (!hasVeloMap) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load products from storage:', e);
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  },

  addProduct(newProdData: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const id = `vz-custom-${Date.now()}`;
    const product: Product = {
      ...newProdData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    products.unshift(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(updated: Product): Product {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === updated.id);
    if (idx !== -1) {
      products[idx] = updated;
      this.saveProducts(products);
    }
    return updated;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      const parsed = JSON.parse(data);
      const hasApparel = parsed.some((c: Category) => c.id === 'apparel');
      if (!hasApparel) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return parsed;
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        const demoOrders: Order[] = [
          {
            id: 'ord-1001',
            orderNumber: 'VZ-2026-1042',
            date: '2026-10-31 14:20',
            customer: {
              fullName: 'ლევან ბერიძე',
              phone: '+995 599 12 34 56',
              email: 'levan.beridze@example.ge',
              city: 'თბილისი',
              address: 'ვაჟა-ფშაველას გამზ. 45, ბინა 18',
              notes: 'გთხოვთ დარეკოთ მოსვლამდე 30 წუთით ადრე',
            },
            items: [
              {
                productId: 'vz-road-01',
                nameKa: 'VELOZONE AERO VELOCE SLR',
                nameEn: 'VELOZONE AERO VELOCE SLR',
                price: 8950,
                quantity: 1,
                image: '/src/assets/images/product_road_race_1793606283895.jpg',
                size: '54 cm (M)',
              },
            ],
            subtotal: 8950,
            shippingFee: 0,
            totalAmount: 8950,
            paymentMethod: 'card',
            status: 'processing',
          },
          {
            id: 'ord-1002',
            orderNumber: 'VZ-2026-1043',
            date: '2026-11-01 11:05',
            customer: {
              fullName: 'ანა კაპანაძე',
              phone: '+995 577 98 76 54',
              email: 'ana.kapanadze@example.ge',
              city: 'ბათუმი',
              address: 'რუსთაველის ქუჩა 12, კორპუსი 3',
              notes: '',
            },
            items: [
              {
                productId: 'vz-optics-glass-01',
                nameKa: 'SIROKO K3 PRO CYCLING OPTICS SUNGLASSES',
                nameEn: 'SIROKO K3 PRO CYCLING OPTICS SUNGLASSES',
                price: 290,
                quantity: 1,
                image: '/assets/aistudio/image_656e6248.png',
                size: 'Standard Pro Fit',
              },
            ],
            subtotal: 290,
            shippingFee: 0,
            totalAmount: 290,
            paymentMethod: 'cod',
            status: 'pending',
          },
        ];
        localStorage.setItem(ORDERS_KEY, JSON.stringify(demoOrders));
        return demoOrders;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Order {
    const orders = this.getOrders();
    const orderNum = `VZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleString('ka-GE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
    };
    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      target.status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  },

  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveWishlist(ids: string[]): void {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  },

  // Authorized owner accounts
  isUserAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    const email = (user.email || '').trim().toLowerCase();
    const isOwnerEmail = email === 'tavadzeluka053@gmail.com' || email === 'admin@velozone.ge';
    return isOwnerEmail || (Boolean(user.isAdmin) && user.id === 'usr-admin-owner');
  },

  getCurrentUser(): UserProfile | null {
    try {
      // Remove any legacy auto-seeded keys
      localStorage.removeItem('velozone_current_user_v2');
      localStorage.removeItem('velozone_current_user_v3');
      localStorage.removeItem('velozone_current_user');

      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) {
        return null; // Guest by default!
      }
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        const email = (parsed.email || '').trim().toLowerCase();
        parsed.isAdmin = email === 'tavadzeluka053@gmail.com' || email === 'admin@velozone.ge' || parsed.id === 'usr-admin-owner';
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set current user:', e);
    }
  },

  loginWithGoogle(email = 'customer@velozone.ge', fullName = 'VELOZONE მომხმარებელი'): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === 'tavadzeluka053@gmail.com' || cleanEmail === 'admin@velozone.ge';
    const user: UserProfile = {
      id: isOwner ? 'usr-admin-owner' : `usr-google-${Date.now()}`,
      email: cleanEmail,
      fullName: isOwner ? 'Luka Tavadze (Owner)' : fullName,
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      isAdmin: isOwner,
      provider: 'google',
    };
    this.setCurrentUser(user);
    return user;
  },

  loginWithEmail(email: string, fullName: string): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === 'tavadzeluka053@gmail.com' || cleanEmail === 'admin@velozone.ge';
    const user: UserProfile = {
      id: isOwner ? 'usr-admin-owner' : `usr-email-${Date.now()}`,
      email: cleanEmail,
      fullName: isOwner ? 'Luka Tavadze (Owner)' : (fullName || cleanEmail.split('@')[0]),
      isAdmin: isOwner,
      provider: 'email',
    };
    this.setCurrentUser(user);
    return user;
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('velozone_current_user_v2');
    localStorage.removeItem('velozone_current_user_v3');
    localStorage.removeItem('velozone_current_user');
  },

  resetToDefaults(): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  },
};
