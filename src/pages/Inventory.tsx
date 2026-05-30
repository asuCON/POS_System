import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
type ItemCategory = "vegetables" | "spices" | "dairy" | "grains" | "beverages" | "packaging" | "other";

interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: Date;
  supplier: string;
}

const categoryLabels: Record<ItemCategory, string> = {
  vegetables: "Vegetables",
  spices: "Spices",
  dairy: "Dairy",
  grains: "Grains",
  beverages: "Beverages",
  packaging: "Packaging",
  other: "Other",
};

const generateInventory = (): InventoryItem[] => {
  const items: Omit<InventoryItem, "id" | "lastRestocked">[] = [
    { name: "Onions", category: "vegetables", currentStock: 25, minStock: 10, maxStock: 50, unit: "kg", costPerUnit: 40, supplier: "Fresh Farm" },
    { name: "Tomatoes", category: "vegetables", currentStock: 8, minStock: 10, maxStock: 40, unit: "kg", costPerUnit: 35, supplier: "Fresh Farm" },
    { name: "Potatoes", category: "vegetables", currentStock: 30, minStock: 15, maxStock: 60, unit: "kg", costPerUnit: 25, supplier: "Fresh Farm" },
    { name: "Green Chili", category: "vegetables", currentStock: 3, minStock: 5, maxStock: 15, unit: "kg", costPerUnit: 80, supplier: "Local Market" },
    { name: "Cumin Seeds", category: "spices", currentStock: 2, minStock: 1, maxStock: 5, unit: "kg", costPerUnit: 300, supplier: "Spice World" },
    { name: "Turmeric Powder", category: "spices", currentStock: 1.5, minStock: 2, maxStock: 8, unit: "kg", costPerUnit: 200, supplier: "Spice World" },
    { name: "Garam Masala", category: "spices", currentStock: 3, minStock: 2, maxStock: 10, unit: "kg", costPerUnit: 400, supplier: "Spice World" },
    { name: "Red Chili Powder", category: "spices", currentStock: 0, minStock: 2, maxStock: 8, unit: "kg", costPerUnit: 250, supplier: "Spice World" },
    { name: "Milk", category: "dairy", currentStock: 20, minStock: 10, maxStock: 40, unit: "ltr", costPerUnit: 60, supplier: "DDC Dairy" },
    { name: "Butter", category: "dairy", currentStock: 5, minStock: 3, maxStock: 15, unit: "kg", costPerUnit: 500, supplier: "DDC Dairy" },
    { name: "Paneer", category: "dairy", currentStock: 2, minStock: 3, maxStock: 10, unit: "kg", costPerUnit: 350, supplier: "DDC Dairy" },
    { name: "Basmati Rice", category: "grains", currentStock: 40, minStock: 20, maxStock: 100, unit: "kg", costPerUnit: 120, supplier: "Grain House" },
    { name: "Wheat Flour", category: "grains", currentStock: 15, minStock: 10, maxStock: 50, unit: "kg", costPerUnit: 50, supplier: "Grain House" },
    { name: "Tea Leaves (CTC)", category: "beverages", currentStock: 5, minStock: 3, maxStock: 20, unit: "kg", costPerUnit: 600, supplier: "Tea Estate" },
    { name: "Coffee Beans", category: "beverages", currentStock: 1, minStock: 2, maxStock: 10, unit: "kg", costPerUnit: 800, supplier: "Coffee Hub" },
    { name: "Sugar", category: "beverages", currentStock: 10, minStock: 5, maxStock: 30, unit: "kg", costPerUnit: 50, supplier: "Grain House" },
    { name: "Takeaway Boxes", category: "packaging", currentStock: 200, minStock: 100, maxStock: 500, unit: "pcs", costPerUnit: 5, supplier: "Pack Store" },
    { name: "Paper Cups", category: "packaging", currentStock: 50, minStock: 100, maxStock: 500, unit: "pcs", costPerUnit: 3, supplier: "Pack Store" },
    { name: "Cooking Oil", category: "other", currentStock: 10, minStock: 5, maxStock: 30, unit: "ltr", costPerUnit: 180, supplier: "Oil Depot" },
    { name: "Salt", category: "other", currentStock: 8, minStock: 3, maxStock: 15, unit: "kg", costPerUnit: 20, supplier: "Local Market" },
  ];

  return items.map((item, i) => ({
    ...item,
    id: `inv-${i}`,
    lastRestocked: new Date(2026, 3, Math.floor(Math.random() * 8) + 1),
  }));
};

const getStatus = (item: InventoryItem): StockStatus => {
  if (item.currentStock === 0) return "out_of_stock";
  if (item.currentStock < item.minStock) return "low_stock";
  return "in_stock";
};

const statusConfig: Record<StockStatus, { label: string; icon: React.ReactNode; variant: "default" | "destructive" | "secondary" }> = {
  in_stock: { label: "In Stock", icon: <CheckCircle className="h-3.5 w-3.5" />, variant: "default" },
  low_stock: { label: "Low Stock", icon: <AlertTriangle className="h-3.5 w-3.5" />, variant: "secondary" },
  out_of_stock: { label: "Out of Stock", icon: <XCircle className="h-3.5 w-3.5" />, variant: "destructive" },
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(generateInventory);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ItemCategory>("vegetables");
  const [newStock, setNewStock] = useState("");
  const [newUnit, setNewUnit] = useState("kg");
  const [newCost, setNewCost] = useState("");

  const totalItems = items.length;
  const lowStockCount = items.filter((i) => getStatus(i) === "low_stock").length;
  const outOfStockCount = items.filter((i) => getStatus(i) === "out_of_stock").length;
  const totalValue = items.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  const filtered = items.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && i.category !== catFilter) return false;
    if (statusFilter !== "all" && getStatus(i) !== statusFilter) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newName || !newStock || !newCost) return;
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newName,
      category: newCategory,
      currentStock: Number(newStock),
      minStock: Math.floor(Number(newStock) * 0.3),
      maxStock: Number(newStock) * 3,
      unit: newUnit,
      costPerUnit: Number(newCost),
      lastRestocked: new Date(),
      supplier: "Manual Entry",
    };
    setItems((prev) => [item, ...prev]);
    setNewName("");
    setNewStock("");
    setNewCost("");
    setShowAdd(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground text-sm">Manage stock levels and track supplies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-primary text-primary-foreground" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-xl font-bold text-foreground">{totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-xl font-bold text-accent">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl font-bold text-destructive">{outOfStockCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowUpDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Value</p>
              <p className="text-xl font-bold text-foreground">₹{totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Stock Items ({filtered.length})</h2>
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Restocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const status = getStatus(item);
                const sc = statusConfig[status];
                const stockPercent = Math.min((item.currentStock / item.maxStock) * 100, 100);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{categoryLabels[item.category]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-xs">
                          <span>{item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">/ {item.maxStock}</span>
                        </div>
                        <Progress
                          value={stockPercent}
                          className={`h-1.5 ${status === "out_of_stock" ? "[&>div]:bg-destructive" : status === "low_stock" ? "[&>div]:bg-accent" : "[&>div]:bg-primary"}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-xs flex items-center gap-1 w-fit">
                        {sc.icon}
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{item.costPerUnit}/{item.unit}</TableCell>
                    <TableCell className="font-semibold">₹{(item.currentStock * item.costPerUnit).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.supplier}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.lastRestocked.toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Tomatoes" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as ItemCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={newUnit} onValueChange={setNewUnit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ltr">ltr</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Current Stock</Label>
                <Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Cost per Unit (₹)</Label>
                <Input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder="0" />
              </div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
