
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  icon: string;
  color: string;
  prescription: boolean;
  image?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("farmacia-cart");

      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item?.product &&
                typeof item.product.id === "number" &&
                typeof item.quantity === "number" &&
                item.quantity > 0
            )
          );
        }
      }
    } catch {
      localStorage.removeItem("farmacia-cart");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("farmacia-cart", JSON.stringify(items));
    }
  }, [items, ready]);

  function addToCart(product: Product) {
    setItems((previous) => {
      const existing = previous.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                product,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...previous, { product, quantity: 1 }];
    });
  }

  function updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((previous) =>
      previous.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(id: number) {
    setItems((previous) =>
      previous.filter((item) => item.product.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        ready,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}
