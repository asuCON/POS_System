import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

/* ============ Types ============ */
export type TableStatus = "free" | "busy" | "bill";
export interface RestaurantTable {
  id: string;
  label: string;
  seats: number;
  status: TableStatus;
}

export type MenuCategory = "Starters" | "Mains" | "Desserts" | "Drinks";
export interface MenuSize { label: string; price: number; }
export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  category: MenuCategory;
  type: string;
  emoji: string;
  sizes: MenuSize[];
  available: boolean;
  veg: boolean;
}

export type OrderStatus = "preparing" | "ready" | "served" | "billed" | "cancelled";
export interface OrderItem { name: string; qty: number; price: number; }
export interface Order {
  id: string;
  table: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export type PaymentMethod = "cash" | "esewa" | "bank_transfer" | "card";
export interface Bill {
  id: string;
  billNumber: string;
  table: string;
  orderId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  printed: boolean;
  createdAt: number;
}

export type TxType = "income" | "expense" | "refund";
export type TxChannel = "cash" | "esewa" | "bank" | "card";
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TxType;
  channel: TxChannel;
  date: number;
  reference: string;
}

export type ExpenseCategory = "supplies" | "utilities" | "salary" | "maintenance" | "delivery" | "other";
export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: number;
  paidBy: string;
  receipt: boolean;
}

export type ItemCategory = "vegetables" | "spices" | "dairy" | "grains" | "beverages" | "packaging" | "other";
export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: number;
  supplier: string;
}

/* ============ Seed data ============ */
const seedTables: RestaurantTable[] = [
  { id: "d1", label: "D1", seats: 4, status: "free" },
  { id: "d2", label: "D2", seats: 4, status: "busy" },
  { id: "d3", label: "D3", seats: 4, status: "free" },
  { id: "p1", label: "P1", seats: 2, status: "bill" },
  { id: "p2", label: "P2", seats: 2, status: "busy" },
  { id: "t1", label: "T1", seats: 6, status: "free" },
  { id: "t2", label: "T2", seats: 6, status: "busy" },
  { id: "vip1", label: "VIP 1", seats: 8, status: "free" },
  { id: "vip2", label: "VIP 2", seats: 8, status: "busy" },
  { id: "d4", label: "D4", seats: 4, status: "free" },
  { id: "d5", label: "D5", seats: 4, status: "bill" },
  { id: "t3", label: "T3", seats: 6, status: "free" },
];

const seedMenu: MenuItem[] = [
  { id: "m1", name: "Spring Rolls", basePrice: 120, category: "Starters", type: "snack", emoji: "🥟", sizes: [{ label: "Regular", price: 120 }, { label: "Large", price: 180 }], available: true, veg: true },
  { id: "m2", name: "Garlic Bread", basePrice: 100, category: "Starters", type: "bread", emoji: "🍞", sizes: [{ label: "Regular", price: 100 }], available: true, veg: true },
  { id: "m3", name: "Chicken Soup", basePrice: 150, category: "Starters", type: "soup", emoji: "🍜", sizes: [{ label: "Small", price: 150 }, { label: "Large", price: 220 }], available: true, veg: false },
  { id: "m4", name: "Momo", basePrice: 160, category: "Starters", type: "dumpling", emoji: "🥟", sizes: [{ label: "Steam Momo", price: 160 }, { label: "C Momo", price: 200 }], available: true, veg: false },
  { id: "m5", name: "Grilled Chicken", basePrice: 350, category: "Mains", type: "grill", emoji: "🍗", sizes: [{ label: "Half", price: 350 }, { label: "Full", price: 600 }], available: true, veg: false },
  { id: "m6", name: "Chowmin", basePrice: 60, category: "Mains", type: "noodles", emoji: "🍝", sizes: [{ label: "Veg", price: 60 }, { label: "Chicken", price: 100 }], available: true, veg: false },
  { id: "m7", name: "Biryani", basePrice: 180, category: "Mains", type: "rice", emoji: "🍛", sizes: [{ label: "Veg", price: 180 }, { label: "Chicken", price: 250 }], available: true, veg: false },
  { id: "m8", name: "Pasta", basePrice: 200, category: "Mains", type: "italian", emoji: "🍝", sizes: [{ label: "White", price: 200 }, { label: "Red", price: 200 }], available: true, veg: true },
  { id: "m9", name: "Chocolate Cake", basePrice: 180, category: "Desserts", type: "cake", emoji: "🍫", sizes: [{ label: "Slice", price: 180 }, { label: "Full", price: 900 }], available: true, veg: true },
  { id: "m10", name: "Ice Cream Sundae", basePrice: 150, category: "Desserts", type: "frozen", emoji: "🍨", sizes: [{ label: "Regular", price: 150 }, { label: "Large", price: 220 }], available: true, veg: true },
  { id: "m11", name: "Gulab Jamun", basePrice: 80, category: "Desserts", type: "sweet", emoji: "🍩", sizes: [{ label: "2 pcs", price: 80 }, { label: "4 pcs", price: 140 }], available: true, veg: true },
  { id: "m12", name: "S.S Americano", basePrice: 120, category: "Drinks", type: "coffee", emoji: "☕", sizes: [{ label: "Single Shot", price: 120 }], available: true, veg: true },
  { id: "m13", name: "Masala Chai", basePrice: 40, category: "Drinks", type: "tea", emoji: "🍵", sizes: [{ label: "Regular", price: 40 }, { label: "Large", price: 60 }], available: true, veg: true },
  { id: "m14", name: "Mango Lassi", basePrice: 100, category: "Drinks", type: "beverage", emoji: "🥭", sizes: [{ label: "Regular", price: 100 }], available: true, veg: true },
  { id: "m15", name: "Fresh Lemonade", basePrice: 60, category: "Drinks", type: "juice", emoji: "🍋", sizes: [{ label: "Regular", price: 60 }, { label: "Large", price: 90 }], available: true, veg: true },
];

const now = Date.now();
const min = 60_000;

const seedOrders: Order[] = [
  { id: "ORD-001", table: "D2", items: [{ name: "Biryani Chicken", qty: 1, price: 250 }, { name: "Masala Chai", qty: 2, price: 40 }], total: 330, status: "preparing", createdAt: now - 2 * min },
  { id: "ORD-002", table: "P2", items: [{ name: "Momo Steam", qty: 2, price: 160 }, { name: "Gulab Jamun 2pcs", qty: 1, price: 80 }], total: 400, status: "ready", createdAt: now - 8 * min },
  { id: "ORD-003", table: "VIP 2", items: [{ name: "Grilled Chicken Full", qty: 1, price: 600 }, { name: "Pasta White", qty: 1, price: 200 }], total: 800, status: "served", createdAt: now - 25 * min },
  { id: "ORD-004", table: "T2", items: [{ name: "Chowmin Chicken", qty: 2, price: 100 }], total: 200, status: "preparing", createdAt: now - 1 * min },
];

const seedBills: Bill[] = Array.from({ length: 8 }).map((_, i) => {
  const items: OrderItem[] = [
    { name: "Masala Chai", qty: 2, price: 40 },
    { name: "Momo", qty: 1, price: 160 },
  ];
  const subtotal = items.reduce((s, x) => s + x.qty * x.price, 0);
  const tax = Math.round(subtotal * 0.13);
  const methods: PaymentMethod[] = ["cash", "esewa", "bank_transfer", "card"];
  return {
    id: `bill-seed-${i}`,
    billNumber: `BILL-${433354 + i}`,
    table: ["D1", "D3", "P1", "VIP 1", "T1"][i % 5],
    items,
    subtotal,
    tax,
    discount: 0,
    total: subtotal + tax,
    paymentMethod: methods[i % 4],
    printed: i % 2 === 0,
    createdAt: now - (i + 1) * 60 * min,
  };
});

const seedTransactions: Transaction[] = seedBills.map((b, i) => ({
  id: `tx-seed-${i}`,
  description: `Table ${b.table} bill payment`,
  amount: b.total,
  type: "income",
  channel: b.paymentMethod === "bank_transfer" ? "bank" : (b.paymentMethod as TxChannel),
  date: b.createdAt,
  reference: b.billNumber,
}));

const seedExpenses: Expense[] = [
  { id: "exp-1", title: "Vegetable Purchase", description: "Daily veg supplies", amount: 1800, category: "supplies", date: now - 86400_000, paidBy: "Ram", receipt: true },
  { id: "exp-2", title: "Electricity Bill", description: "April bill", amount: 5400, category: "utilities", date: now - 2 * 86400_000, paidBy: "Owner", receipt: true },
  { id: "exp-3", title: "Staff Salary - Shyam", description: "Monthly salary", amount: 14000, category: "salary", date: now - 3 * 86400_000, paidBy: "Owner", receipt: false },
  { id: "exp-4", title: "Gas Cylinder x2", description: "Kitchen gas", amount: 3200, category: "utilities", date: now - 4 * 86400_000, paidBy: "Hari", receipt: true },
  { id: "exp-5", title: "Packaging Materials", description: "Takeaway boxes", amount: 1200, category: "delivery", date: now - 5 * 86400_000, paidBy: "Ram", receipt: true },
];

const seedInventory: InventoryItem[] = [
  { id: "inv-1", name: "Onions", category: "vegetables", currentStock: 25, minStock: 10, maxStock: 50, unit: "kg", costPerUnit: 40, supplier: "Fresh Farm", lastRestocked: now - 86400_000 },
  { id: "inv-2", name: "Tomatoes", category: "vegetables", currentStock: 8, minStock: 10, maxStock: 40, unit: "kg", costPerUnit: 35, supplier: "Fresh Farm", lastRestocked: now - 2 * 86400_000 },
  { id: "inv-3", name: "Potatoes", category: "vegetables", currentStock: 30, minStock: 15, maxStock: 60, unit: "kg", costPerUnit: 25, supplier: "Fresh Farm", lastRestocked: now - 86400_000 },
  { id: "inv-4", name: "Green Chili", category: "vegetables", currentStock: 3, minStock: 5, maxStock: 15, unit: "kg", costPerUnit: 80, supplier: "Local Market", lastRestocked: now - 3 * 86400_000 },
  { id: "inv-5", name: "Cumin Seeds", category: "spices", currentStock: 2, minStock: 1, maxStock: 5, unit: "kg", costPerUnit: 300, supplier: "Spice World", lastRestocked: now - 7 * 86400_000 },
  { id: "inv-6", name: "Turmeric Powder", category: "spices", currentStock: 1.5, minStock: 2, maxStock: 8, unit: "kg", costPerUnit: 200, supplier: "Spice World", lastRestocked: now - 5 * 86400_000 },
  { id: "inv-7", name: "Red Chili Powder", category: "spices", currentStock: 0, minStock: 2, maxStock: 8, unit: "kg", costPerUnit: 250, supplier: "Spice World", lastRestocked: now - 10 * 86400_000 },
  { id: "inv-8", name: "Milk", category: "dairy", currentStock: 20, minStock: 10, maxStock: 40, unit: "ltr", costPerUnit: 60, supplier: "DDC Dairy", lastRestocked: now - 86400_000 },
  { id: "inv-9", name: "Paneer", category: "dairy", currentStock: 2, minStock: 3, maxStock: 10, unit: "kg", costPerUnit: 350, supplier: "DDC Dairy", lastRestocked: now - 2 * 86400_000 },
  { id: "inv-10", name: "Basmati Rice", category: "grains", currentStock: 40, minStock: 20, maxStock: 100, unit: "kg", costPerUnit: 120, supplier: "Grain House", lastRestocked: now - 4 * 86400_000 },
  { id: "inv-11", name: "Tea Leaves (CTC)", category: "beverages", currentStock: 5, minStock: 3, maxStock: 20, unit: "kg", costPerUnit: 600, supplier: "Tea Estate", lastRestocked: now - 6 * 86400_000 },
  { id: "inv-12", name: "Coffee Beans", category: "beverages", currentStock: 1, minStock: 2, maxStock: 10, unit: "kg", costPerUnit: 800, supplier: "Coffee Hub", lastRestocked: now - 8 * 86400_000 },
  { id: "inv-13", name: "Paper Cups", category: "packaging", currentStock: 50, minStock: 100, maxStock: 500, unit: "pcs", costPerUnit: 3, supplier: "Pack Store", lastRestocked: now - 5 * 86400_000 },
  { id: "inv-14", name: "Cooking Oil", category: "other", currentStock: 10, minStock: 5, maxStock: 30, unit: "ltr", costPerUnit: 180, supplier: "Oil Depot", lastRestocked: now - 3 * 86400_000 },
];

/* ============ Persistence helper ============ */
const STORAGE_KEY = "ccc-pos-data-v1";
const TAX_RATE = 0.13;

interface PersistedState {
  tables: RestaurantTable[];
  menuItems: MenuItem[];
  orders: Order[];
  bills: Bill[];
  transactions: Transaction[];
  expenses: Expense[];
  inventory: InventoryItem[];
  counters: { order: number; bill: number };
}

const initialState: PersistedState = {
  tables: seedTables,
  menuItems: seedMenu,
  orders: seedOrders,
  bills: seedBills,
  transactions: seedTransactions,
  expenses: seedExpenses,
  inventory: seedInventory,
  counters: { order: 5, bill: 433362 },
};

function load(): PersistedState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as PersistedState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

/* ============ Context ============ */
interface DataContextValue extends PersistedState {
  taxRate: number;
  // tables
  addTable: (label: string, seats: number) => void;
  setTableStatus: (id: string, status: TableStatus) => void;
  // menu
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  toggleMenuAvailable: (id: string) => void;
  deleteMenuItem: (id: string) => void;
  // orders
  placeOrder: (table: string, items: OrderItem[]) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;
  // bills
  payOrder: (orderId: string, method: PaymentMethod, discount?: number) => Bill | null;
  markBillPrinted: (id: string) => void;
  // expenses
  addExpense: (e: Omit<Expense, "id" | "date">) => void;
  // inventory
  addInventoryItem: (i: Omit<InventoryItem, "id" | "lastRestocked">) => void;
  restockItem: (id: string, qty: number) => void;
  // misc
  resetAll: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const update = useCallback((patch: Partial<PersistedState> | ((s: PersistedState) => Partial<PersistedState>)) => {
    setState((s) => {
      const p = typeof patch === "function" ? patch(s) : patch;
      return { ...s, ...p };
    });
  }, []);

  /* ===== Tables ===== */
  const addTable: DataContextValue["addTable"] = (label, seats) => {
    const id = label.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 5);
    update((s) => ({ tables: [...s.tables, { id, label, seats, status: "free" }] }));
  };
  const setTableStatus: DataContextValue["setTableStatus"] = (id, status) => {
    update((s) => ({ tables: s.tables.map((t) => (t.id === id ? { ...t, status } : t)) }));
  };

  /* ===== Menu ===== */
  const addMenuItem: DataContextValue["addMenuItem"] = (item) => {
    update((s) => ({ menuItems: [...s.menuItems, { ...item, id: "m" + Date.now() }] }));
  };
  const toggleMenuAvailable: DataContextValue["toggleMenuAvailable"] = (id) => {
    update((s) => ({ menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) }));
  };
  const deleteMenuItem: DataContextValue["deleteMenuItem"] = (id) => {
    update((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== id) }));
  };

  /* ===== Orders ===== */
  const placeOrder: DataContextValue["placeOrder"] = (table, items) => {
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    let created!: Order;
    update((s) => {
      const num = s.counters.order + 1;
      const id = `ORD-${String(num).padStart(3, "0")}`;
      created = { id, table, items, total, status: "preparing", createdAt: Date.now() };
      // mark table busy
      const tables = s.tables.map((t) => (t.label === table && t.status === "free" ? { ...t, status: "busy" as TableStatus } : t));
      return {
        orders: [created, ...s.orders],
        tables,
        counters: { ...s.counters, order: num },
      };
    });
    return created;
  };
  const setOrderStatus: DataContextValue["setOrderStatus"] = (id, status) => {
    update((s) => {
      const orders = s.orders.map((o) => (o.id === id ? { ...o, status } : o));
      let tables = s.tables;
      // if served → mark table bill
      const o = orders.find((x) => x.id === id);
      if (o && status === "served") {
        tables = s.tables.map((t) => (t.label === o.table ? { ...t, status: "bill" as TableStatus } : t));
      }
      return { orders, tables };
    });
  };
  const cancelOrder: DataContextValue["cancelOrder"] = (id) => {
    update((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" as OrderStatus } : o)) }));
  };

  /* ===== Bills ===== */
  const payOrder: DataContextValue["payOrder"] = (orderId, method, discount = 0) => {
    let bill: Bill | null = null;
    update((s) => {
      const order = s.orders.find((o) => o.id === orderId);
      if (!order) return {};
      const subtotal = order.total;
      const tax = Math.round(subtotal * TAX_RATE);
      const total = subtotal + tax - discount;
      const num = s.counters.bill + 1;
      bill = {
        id: "bill-" + Date.now(),
        billNumber: `BILL-${num}`,
        table: order.table,
        orderId: order.id,
        items: order.items,
        subtotal, tax, discount, total,
        paymentMethod: method,
        printed: false,
        createdAt: Date.now(),
      };
      const tx: Transaction = {
        id: "tx-" + Date.now(),
        description: `Table ${order.table} bill payment`,
        amount: total,
        type: "income",
        channel: method === "bank_transfer" ? "bank" : (method as TxChannel),
        date: Date.now(),
        reference: bill.billNumber,
      };
      const orders = s.orders.map((o) => (o.id === orderId ? { ...o, status: "billed" as OrderStatus } : o));
      const tables = s.tables.map((t) => (t.label === order.table ? { ...t, status: "free" as TableStatus } : t));
      return {
        orders, tables,
        bills: [bill, ...s.bills],
        transactions: [tx, ...s.transactions],
        counters: { ...s.counters, bill: num },
      };
    });
    return bill;
  };
  const markBillPrinted: DataContextValue["markBillPrinted"] = (id) => {
    update((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, printed: true } : b)) }));
  };

  /* ===== Expenses ===== */
  const addExpense: DataContextValue["addExpense"] = (e) => {
    const expense: Expense = { ...e, id: "exp-" + Date.now(), date: Date.now() };
    const tx: Transaction = {
      id: "tx-" + Date.now(),
      description: expense.title,
      amount: expense.amount,
      type: "expense",
      channel: "cash",
      date: expense.date,
      reference: expense.id.toUpperCase(),
    };
    update((s) => ({
      expenses: [expense, ...s.expenses],
      transactions: [tx, ...s.transactions],
    }));
  };

  /* ===== Inventory ===== */
  const addInventoryItem: DataContextValue["addInventoryItem"] = (i) => {
    update((s) => ({ inventory: [{ ...i, id: "inv-" + Date.now(), lastRestocked: Date.now() }, ...s.inventory] }));
  };
  const restockItem: DataContextValue["restockItem"] = (id, qty) => {
    update((s) => {
      const inventory = s.inventory.map((it) =>
        it.id === id ? { ...it, currentStock: Math.min(it.maxStock, it.currentStock + qty), lastRestocked: Date.now() } : it
      );
      const item = inventory.find((x) => x.id === id);
      const cost = item ? qty * item.costPerUnit : 0;
      const tx: Transaction = {
        id: "tx-" + Date.now(),
        description: `Restock ${item?.name ?? "item"} (${qty} ${item?.unit})`,
        amount: cost,
        type: "expense",
        channel: "cash",
        date: Date.now(),
        reference: id.toUpperCase(),
      };
      const expense: Expense = {
        id: "exp-" + Date.now(),
        title: `Restock ${item?.name ?? "item"}`,
        description: `${qty} ${item?.unit} @ ₹${item?.costPerUnit}`,
        amount: cost,
        category: "supplies",
        date: Date.now(),
        paidBy: "Owner",
        receipt: true,
      };
      return {
        inventory,
        transactions: [tx, ...s.transactions],
        expenses: [expense, ...s.expenses],
      };
    });
  };

  const resetAll = () => setState(initialState);

  const value: DataContextValue = {
    ...state,
    taxRate: TAX_RATE,
    addTable, setTableStatus,
    addMenuItem, toggleMenuAvailable, deleteMenuItem,
    placeOrder, setOrderStatus, cancelOrder,
    payOrder, markBillPrinted,
    addExpense,
    addInventoryItem, restockItem,
    resetAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
