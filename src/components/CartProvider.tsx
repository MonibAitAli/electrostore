"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "electro.cart.v1";

export type CartLine = { id: number; slug: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  qtyOf: (id: number) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * The cart is an external system (localStorage), so it is read through
 * useSyncExternalStore rather than copied into state by an effect. That also
 * gives cross-tab updates for free, and keeps the server render empty so the
 * first client paint cannot mismatch.
 */
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.flatMap((entry): CartLine[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const row = entry as Record<string, unknown>;
      const id = typeof row.id === "number" ? row.id : Number(row.id);
      const qty = typeof row.qty === "number" ? row.qty : Number(row.qty);
      if (!Number.isFinite(id) || !Number.isFinite(qty)) return [];
      return [{ id, slug: typeof row.slug === "string" ? row.slug : String(id), qty }];
    });
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  cache = parse(window.localStorage.getItem(STORAGE_KEY));
  return cache;
}

const getServerSnapshot = (): CartLine[] => EMPTY;

function notify(): void {
  for (const listener of listeners) listener();
}

function commit(lines: CartLine[]): void {
  cache = lines;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Another tab wrote the same key: adopt its value instead of overwriting it.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = event.newValue === null ? EMPTY : parse(event.newValue);
    notify();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

/** True only after hydration, so UI can hold back until localStorage is read. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useHydrated();

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    const current = getSnapshot();
    const existing = current.find((item) => item.id === line.id);
    commit(
      existing
        ? current.map((item) =>
            item.id === line.id ? { ...item, qty: item.qty + qty } : item,
          )
        : [...current, { ...line, qty }],
    );
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    const current = getSnapshot();
    commit(
      qty <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  }, []);

  const remove = useCallback((id: number) => {
    commit(getSnapshot().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    return {
      lines,
      count,
      ready,
      add,
      setQty,
      remove,
      clear,
      qtyOf: (id: number) => lines.find((line) => line.id === id)?.qty ?? 0,
    };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}