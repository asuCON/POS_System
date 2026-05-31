import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, RefreshCw, Search, UtensilsCrossed, ShoppingCart, Trash2, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useData, MenuCategory, MenuItem } from "@/contexts/DataContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  Starters: "bg-orange-500 text-white",
  Mains: "bg-emerald-500 text-white",
  Desserts: "bg-pink-500 text-white",
  Drinks: "bg-sky-500 text-white",
};

const categories: (MenuCategory | "All")[] = ["All", "Starters", "Mains", "Desserts", "Drinks"];

interface CartLine {
  key: string;
  name: string;
  price: number;
  qty: number;
}

const Menu = () => {
  const { menuItems, addMenuItem, toggleMenuAvailable, deleteMenuItem, placeOrder, tables } = useData();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tableFromUrl = searchParams.get("table") || "";
  const [orderMode, setOrderMode] = useState(!!tableFromUrl);
  const [selectedTable, setSelectedTable] = useState(tableFromUrl || "");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<MenuCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", basePrice: "", category: "Starters" as MenuCategory, type: "", emoji: "🍽️",
  });

  useEffect(() => {
    if (tableFromUrl) {
      setOrderMode(true);
      setSelectedTable(tableFromUrl);
      setCartOpen(true);
    }
  }, [tableFromUrl]);

  const filtered = useMemo(() => menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [menuItems, activeCategory, search]);

  const addToCart = (item: MenuItem, size = item.sizes[0]) => {
    const name = `${item.name}${item.sizes.length > 1 ? " " + size.label : ""}`;
    const key = item.id + "-" + size.label;
    setCart((c) => {
      const ex = c.find((x) => x.key === key);
      if (ex) return c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { key, name, price: size.price, qty: 1 }];
    });
    toast.success(`${name} added to cart`);
    setCartOpen(true);
  };

  const changeQty = (key: string, delta: number) => {
    setCart((c) =>
      c.flatMap((x) => {
        if (x.key !== key) return [x];
        const q = x.qty + delta;
        return q <= 0 ? [] : [{ ...x, qty: q }];
      })
    );
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handlePlaceOrder = () => {
    if (!selectedTable) { toast.error("Select a table first"); return; }
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    const order = placeOrder(selectedTable, cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })));
    addNotification("order", "New Order", `Order ${order.id} received from Table ${selectedTable}`);
    toast.success(`Order ${order.id} placed`);
    setCart([]);
    setCartOpen(false);
    setOrderMode(false);
    setSearchParams({}, { replace: true });
    navigate("/orders");
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.basePrice) return;
    addMenuItem({
      name: newItem.name,
      basePrice: parseFloat(newItem.basePrice),
      category: newItem.category,
      type: newItem.type || "general",
      emoji: newItem.emoji,
      sizes: [{ label: "Regular", price: parseFloat(newItem.basePrice) }],
      available: true,
      veg: true,
    });
    toast.success(`${newItem.name} added to menu`);
    setNewItem({ name: "", basePrice: "", category: "Starters", type: "", emoji: "🍽️" });
    setDialogOpen(false);
  };

  const freeTables = tables.filter((t) => t.status !== "bill");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
          <p className="text-sm text-muted-foreground">
            {orderMode ? `Building order for Table ${selectedTable || "—"}` : "Manage your restaurant's menu"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!orderMode && (
            <Button variant="outline" onClick={() => { setOrderMode(true); setCartOpen(true); }}>
              <ShoppingCart className="h-4 w-4 mr-1" /> New Order
            </Button>
          )}
          {orderMode && (
            <Button variant="outline" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Cart ({cart.length})
            </Button>
          )}
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
          <Button variant="outline" onClick={() => { setActiveCategory("All"); setSearch(""); toast.success("Menu refreshed"); }}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group relative">
            <div className="absolute top-3 left-3 z-10">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${categoryColors[item.category]}`}>{item.category}</span>
            </div>
            <div className="absolute top-3 left-3 mt-8 flex gap-1 z-10">
              {item.veg ? (
                <span className="w-4 h-4 rounded-sm border-2 border-green-500 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-sm border-2 border-red-500 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </span>
              )}
            </div>
            <button
              onClick={() => deleteMenuItem(item.id)}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
              title="Delete item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="h-40 bg-muted/50 flex items-center justify-center relative overflow-hidden">
              <div className="text-6xl group-hover:scale-110 transition-transform">{item.emoji}</div>
              {!item.available && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <span className="text-sm font-bold text-destructive">Unavailable</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-foreground text-base">{item.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg">₹{item.basePrice.toFixed(2)}</span>
                <span className="text-muted-foreground text-xs">base</span>
                <button
                  onClick={() => toggleMenuAvailable(item.id)}
                  className={`ml-auto w-2.5 h-2.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-destructive'}`}
                  title="Toggle availability"
                />
              </div>
              <p className="text-xs text-muted-foreground">{item.type}</p>
              {item.sizes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Sizes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sizes.map((s, i) => (
                      <button
                        key={i}
                        disabled={!item.available}
                        onClick={() => addToCart(item, s)}
                        className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:hover:bg-secondary disabled:hover:text-secondary-foreground"
                      >
                        {s.label}: ₹{s.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button size="sm" className="w-full mt-2" disabled={!item.available} onClick={() => addToCart(item)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No menu items found</p>
        </div>
      )}

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>New Order</span>
              <Badge variant="secondary">{cart.length} items</Badge>
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-2 mt-4">
            <Label>Table</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
              <SelectContent>
                {freeTables.map((t) => (
                  <SelectItem key={t.id} value={t.label}>
                    {t.label} ({t.seats} seats) {t.status === "busy" && "— in use"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto mt-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                Add items from the menu
              </div>
            ) : cart.map((line) => (
              <div key={line.key} className="flex items-center gap-2 border border-border rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{line.name}</p>
                  <p className="text-xs text-muted-foreground">₹{line.price} × {line.qty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(line.key, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{line.qty}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(line.key, +1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setCart((c) => c.filter((x) => x.key !== line.key))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <SheetFooter className="border-t pt-4 mt-4 flex-col gap-2 sm:flex-col">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <Button className="w-full" disabled={cart.length === 0 || !selectedTable} onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" />
            </div>
            <div className="space-y-1">
              <Label>Base Price (₹)</Label>
              <Input type="number" value={newItem.basePrice} onChange={(e) => setNewItem({ ...newItem, basePrice: e.target.value })} placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Input value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })} placeholder="e.g. coffee, noodles, grill" />
            </div>
            <div className="space-y-1">
              <Label>Emoji</Label>
              <Input value={newItem.emoji} onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })} placeholder="🍽️" />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v as MenuCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starters">Starters</SelectItem>
                  <SelectItem value="Mains">Mains</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                  <SelectItem value="Drinks">Drinks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
