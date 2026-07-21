"use client";

import React, {
  useEffect,
  useState,
  useContext as useReactContext,
  useMemo,
  PropsWithChildren,
} from "react";
import { products as productsData } from "@/data/products";
import { teamData as teamDataData } from "@/data/team";
import { Product } from "@/types/products";
import { TeamMember } from "@/types/team";

/* ---------------------------- Types & Interfaces ---------------------------- */
// Minimal shape inferred from usage. Extend as needed to match your data modules.
export type IdLike = string | number;

export interface CartProduct extends Product {
  quantity: number; // ensured on cart items
}

interface ContextValue {
  cartProducts: CartProduct[];
  setCartProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
  totalPrice: number;
  addProductToCart: (id: IdLike, qty?: number, isModal?: boolean) => void;
  isAddedToCartProducts: (id: IdLike) => boolean;
  quickViewItem: Product;
  setQuickViewItem: React.Dispatch<React.SetStateAction<Product>>;
  updateQuantity: (id: IdLike, qty: number) => void;
  currentTeamMember: TeamMember;
  setCurrentTeamMember: React.Dispatch<React.SetStateAction<TeamMember>>;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* --------------------------------- Context -------------------------------- */
const dataContext = React.createContext<ContextValue | null>(null);
export const useContextElement = (): ContextValue => {
  const ctx = useReactContext(dataContext);
  if (!ctx)
    throw new Error("useContextElement must be used within <Context />");
  return ctx;
};

/* ----------------------- localStorage safety helpers ----------------------- */
const storageAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const k = "__storage_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
};

const safeGet = <T,>(key: string, fallback: T): T => {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
};

const safeSet = (key: string, value: unknown): void => {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota/private mode errors */
  }
};
/* -------------------------------------------------------------------------- */

/* ------------------------------- Component -------------------------------- */
export default function Context({ children }: PropsWithChildren) {
  // Coerce imported data to typed arrays. Replace `as` with real typings if available.
  const products = productsData as unknown as Product[];
  const teamData = teamDataData as unknown as TeamMember[];

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<Product>(products[0]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember>(
    teamData[0]
  );

  // Load cart once on mount (SSR-safe)
  useEffect(() => {
    const items = safeGet<CartProduct[]>("cartList", []);
    if (Array.isArray(items) && items.length) setCartProducts(items);
  }, []);

  // Persist cart when it changes (SSR-safe)
  useEffect(() => {
    safeSet("cartList", cartProducts);
  }, [cartProducts]);

  // Subtotal calculation
  useEffect(() => {
    const subtotal = cartProducts.reduce((acc, product) => {
      const q = Number(product.quantity) || 0;
      const p = Number(product.price) || 0;
      return acc + q * p;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id: IdLike): boolean =>
    !!cartProducts.find((elm) => String(elm.id) === String(id));

  const addProductToCart = (
    id: IdLike,
    qty: number = 1,
    isModal: boolean = true
  ): void => {
    if (isAddedToCartProducts(id)) return;

    const base = products.find((elm) => String(elm.id) === String(id));
    if (!base) return;

    const item: CartProduct = {
      ...(base as Product),
      quantity: qty && qty >= 1 ? Number(qty) : 1,
    };

    setCartProducts((pre) => [...pre, item]);

    if (isModal) {
      // openCartModal();
    }
  };

  const updateQuantity = (id: IdLike, qty: number): void => {
    if (!isAddedToCartProducts(id) || qty < 1) return;

    setCartProducts((items) =>
      items.map((it) =>
        String(it.id) === String(id) ? { ...it, quantity: Number(qty) } : it
      )
    );
  };

  const contextElement: ContextValue = useMemo(
    () => ({
      cartProducts,
      setCartProducts,
      totalPrice,
      addProductToCart,
      isAddedToCartProducts,
      quickViewItem,
      setQuickViewItem,
      updateQuantity,
      currentTeamMember,
      setCurrentTeamMember,
      isSearchModalOpen,
      setIsSearchModalOpen,
    }),
    [
      cartProducts,
      totalPrice,
      quickViewItem,
      currentTeamMember,
      isSearchModalOpen,
    ]
  );

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
