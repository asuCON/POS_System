import { useState } from "react";
import { Plus, RefreshCw, Search, ImageIcon, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MenuCategory = "All" | "Starters" | "Mains" | "Desserts" | "Drinks";

interface MenuSize {
  label: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  category: Exclude<MenuCategory, "All">;
  type: string;
  emoji: string;
  sizes: MenuSize[];
  available: boolean;
  veg: boolean;
}

const initialMenu: MenuItem[] = [
  { id: "1", name: "Spring Rolls", basePrice: 120, category: "Starters", type: "snack", emoji: "🥟", sizes: [{ label: "Regular", price: 120 }, { label: "Large", price: 180 }], available: true, veg: true },
  { id: "2", name: "Garlic Bread", basePrice: 100, category: "Starters", type: "bread", emoji: "🍞", sizes: [{ label: "Regular", price: 100 }], available: true, veg: true },
  { id: "3", name: "Chicken Soup", basePrice: 150, category: "Starters", type: "soup", emoji: "🍜", sizes: [{ label: "Small", price: 150 }, { label: "Large", price: 220 }], available: true, veg: false },
  { id: "4", name: "Momo", basePrice: 100, category: "Starters", type: "dumpling", emoji: "🥟", sizes: [{ label: "Steam Momo", price: 160 }, { label: "C Momo", price: 200 }], available: true, veg: false },
  { id: "5", name: "Grilled Chicken", basePrice: 350, category: "Mains", type: "grill", emoji: "🍗", sizes: [{ label: "Half", price: 350 }, { label: "Full", price: 600 }], available: true, veg: false },
  { id: "6", name: "Chowmin", basePrice: 50, category: "Mains", type: "noodles", emoji: "🍝", sizes: [{ label: "Veg Chowmin", price: 60 }, { label: "Chicken Chowmin", price: 100 }], available: true, veg: false },
  { id: "7", name: "Biryani", basePrice: 180, category: "Mains", type: "rice", emoji: "🍛", sizes: [{ label: "Veg", price: 180 }, { label: "Chicken", price: 250 }], available: true, veg: false },
  { id: "8", name: "Fish & Chips", basePrice: 280, category: "Mains", type: "seafood", emoji: "🐟", sizes: [{ label: "Regular", price: 280 }], available: false, veg: false },
  { id: "9", name: "Pasta", basePrice: 200, category: "Mains", type: "italian", emoji: "🍝", sizes: [{ label: "White Sauce", price: 200 }, { label: "Red Sauce", price: 200 }], available: true, veg: true },
  { id: "10", name: "Chocolate Cake", basePrice: 180, category: "Desserts", type: "cake", emoji: "🍫", sizes: [{ label: "Slice", price: 180 }, { label: "Full", price: 900 }], available: true, veg: true },
  { id: "11", name: "Ice Cream Sundae", basePrice: 150, category: "Desserts", type: "frozen", emoji: "🍨", sizes: [{ label: "Regular", price: 150 }, { label: "Large", price: 220 }], available: true, veg: true },
  { id: "12", name: "Gulab Jamun", basePrice: 80, category: "Desserts", type: "sweet", emoji: "🍩", sizes: [{ label: "2 pcs", price: 80 }, { label: "4 pcs", price: 140 }], available: true, veg: true },
  { id: "13", name: "S.S Americano", basePrice: 120, category: "Drinks", type: "coffee", emoji: "☕", sizes: [{ label: "Single Shot", price: 120 }], available: true, veg: true },
  { id: "14", name: "Masala Chai", basePrice: 40, category: "Drinks", type: "tea", emoji: "🍵", sizes: [{ label: "Regular", price: 40 }, { label: "Large", price: 60 }], available: true, veg: true },
  { id: "15", name: "Mango Lassi", basePrice: 100, category: "Drinks", type: "beverage", emoji: "🥭", sizes: [{ label: "Regular", price: 100 }], available: true, veg: true },
  { id: "16", name: "Fresh Lemonade", basePrice: 60, category: "Drinks", type: "juice", emoji: "🍋", sizes: [{ label: "Regular", price: 60 }, { label: "Large", price: 90 }], available: true, veg: true },
];

const categoryColors: Record<string, string> = {
  Starters: "bg-orange-500 text-white",
  Mains: "bg-emerald-500 text-white",
  Desserts: "bg-pink-500 text-white",
  Drinks: "bg-sky-500 text-white",
};

const categories: MenuCategory[] = ["All", "Starters", "Mains", "Desserts", "Drinks"];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    basePrice: "",
    category: "Starters" as Exclude<MenuCategory, "All">,
    type: "",
    emoji: "🍽️",
  });

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = () => {
    if (!newItem.name || !newItem.basePrice) return;
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      basePrice: parseFloat(newItem.basePrice),
      category: newItem.category,
      type: newItem.type || "general",
      emoji: newItem.emoji,
      sizes: [{ label: "Regular", price: parseFloat(newItem.basePrice) }],
      available: true,
      veg: true,
    };
    setMenuItems((prev) => [...prev, item]);
    setNewItem({ name: "", basePrice: "", category: "Starters", type: "", emoji: "🍽️" });
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Manage your restaurant's menu items with images and icons</p>
        </div>
        <div className="flex gap-2">
          <Button size="default" onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
          <Button variant="outline" size="default" onClick={() => setMenuItems(initialMenu)}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group relative"
          >
            {/* Category badge top-left */}
            <div className="absolute top-3 left-3 z-10">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${categoryColors[item.category]}`}>
                {item.category}
              </span>
            </div>

            {/* Veg / Non-veg indicators */}
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

            {/* Image area */}
            <div className="h-40 bg-muted/50 flex items-center justify-center relative overflow-hidden">
              <div className="text-6xl group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>
              {!item.available && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <span className="text-sm font-bold text-destructive">Unavailable</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-foreground text-base">{item.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg">₹{item.basePrice.toFixed(2)}</span>
                <span className="text-muted-foreground text-xs">base</span>
                <span className={`ml-auto w-2.5 h-2.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-destructive'}`} />
              </div>
              <p className="text-xs text-muted-foreground">{item.type}</p>

              {/* Sizes */}
              {item.sizes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Sizes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sizes.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md"
                      >
                        {s.label}: ₹{s.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Add Item Dialog */}
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
              <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v as any })}>
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
