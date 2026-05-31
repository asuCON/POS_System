import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Package, Plus, Search, AlertTriangle, CheckCircle, XCircle, RefreshCw, ArrowUpDown, Download,
} from "lucide-react";
import { useData, ItemCategory, InventoryItem } from "@/contexts/DataContext";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationContext";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

const categoryLabels: Record<ItemCategory, string> = {
  vegetables: "Vegetables", spices: "Spices", dairy: "Dairy", grains: "Grains",
  beverages: "Beverages", packaging: "Packaging", other: "Other",
};

const getStatus = (item: InventoryItem): StockStatus => {
  if (item.currentStock <= 0) return "out_of_stock";
  if (item.currentStock < item.minStock) return "low_stock";
  return "in_stock";
};

const statusConfig: Record<StockStatus, { label: string; icon: React.ReactNode; variant: "default" | "destructive" | "secondary" }> = {
  in_stock: { label: "In Stock", icon: <CheckCircle className="h-3.5 w-3.5" />, variant: "default" },
  low_stock: { label: "Low Stock", icon: <AlertTriangle className="h-3.5 w-3.5" />, variant: "secondary" },
  out_of_stock: { label: "Out of Stock", icon: <XCircle className="h-3.5 w-3.5" />, variant: "destructive" },
};

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Inventory() {
  const { inventory, addInventoryItem, restockItem } = useData();
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [restockTarget, setRestockTarget] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState("");

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ItemCategory>("vegetables");
  const [newStock, setNewStock] = useState("");
  const [newUnit, setNewUnit] = useState("kg");
  const [newCost, setNewCost] = useState("");

  const totalItems = inventory.length;
  const lowStockCount = inventory.filter((i) => getStatus(i) === "low_stock").length;
  const outOfStockCount = inventory.filter((i) => getStatus(i) === "out_of_stock").length;
  const totalValue = inventory.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  const filtered = inventory.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && i.category !== catFilter) return false;
    if (statusFilter !== "all" && getStatus(i) !== statusFilter) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newName || !newStock || !newCost) { toast.error("Name, stock and cost required"); return; }
    const stock = Number(newStock);
    addInventoryItem({
      name: newName, category: newCategory, currentStock: stock,
      minStock: Math.max(1, Math.floor(stock * 0.3)),
      maxStock: Math.max(stock, stock * 3),
      unit: newUnit, costPerUnit: Number(newCost),
      supplier: "Manual Entry",
    });
    toast.success(`${newName} added to inventory`);
    setNewName(""); setNewStock(""); setNewCost("");
    setShowAdd(false);
  };

  const handleRestock = () => {
    if (!restockTarget) return;
    const qty = Number(restockQty);
    if (!qty || qty <= 0) { toast.error("Enter a valid quantity"); return; }
    restockItem(restockTarget.id, qty);
    addNotification("stock", "Stock Updated", `${restockTarget.name} restocked by ${qty} ${restockTarget.unit}`);
    toast.success(`${restockTarget.name} restocked (+${qty} ${restockTarget.unit})`);
    setRestockTarget(null); setRestockQty("");
  };

  const handleRefresh = () => {
    const alerts = inventory.filter((i) => getStatus(i) !== "in_stock");
    toast.success(`Refreshed · ${alerts.length} alert${alerts.length === 1 ? "" : "s"}`);
  };

  const handleExport = () => {
    downloadCSV("inventory.csv", [
      ["Item", "Category", "Current Stock", "Unit", "Min", "Max", "Cost/Unit", "Value", "Supplier", "Last Restocked"],
      ...filtered.map((i) => [i.name, categoryLabels[i.category], i.currentStock, i.unit, i.minStock, i.maxStock, i.costPerUnit, i.currentStock * i.costPerUnit, i.supplier, new Date(i.lastRestocked).toLocaleDateString()]),
    ]);
    toast.success("Inventory exported");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground text-sm">Manage stock levels and track supplies</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button variant="outline" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
          <Button className="bg-primary text-primary-foreground" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Items" value={totalItems} tone="primary" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStockCount} tone="accent" />
        <StatCard icon={XCircle} label="Out of Stock" value={outOfStockCount} tone="destructive" />
        <StatCard icon={ArrowUpDown} label="Stock Value" value={`₹${totalValue.toLocaleString()}`} tone="primary" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}
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
                <TableHead>Action</TableHead>
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
                    <TableCell><Badge variant="secondary" className="text-xs">{categoryLabels[item.category]}</Badge></TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-xs">
                          <span>{item.currentStock} {item.unit}</span>
                          <span className="text-muted-foreground">/ {item.maxStock}</span>
                        </div>
                        <Progress value={stockPercent} className={`h-1.5 ${status === "out_of_stock" ? "[&>div]:bg-destructive" : status === "low_stock" ? "[&>div]:bg-accent" : "[&>div]:bg-primary"}`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-xs flex items-center gap-1 w-fit">{sc.icon}{sc.label}</Badge>
                    </TableCell>
                    <TableCell>₹{item.costPerUnit}/{item.unit}</TableCell>
                    <TableCell className="font-semibold">₹{(item.currentStock * item.costPerUnit).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.supplier}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => { setRestockTarget(item); setRestockQty(String(item.maxStock - item.currentStock)); }}>
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No items</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Item Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Tomatoes" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as ItemCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}
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
              <div><Label>Current Stock</Label><Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="0" /></div>
              <div><Label>Cost per Unit (₹)</Label><Input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder="0" /></div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!restockTarget} onOpenChange={(o) => !o && setRestockTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Restock {restockTarget?.name}</DialogTitle></DialogHeader>
          {restockTarget && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Current: <span className="font-medium text-foreground">{restockTarget.currentStock} {restockTarget.unit}</span> · Max: {restockTarget.maxStock} {restockTarget.unit}
              </div>
              <div>
                <Label>Add quantity ({restockTarget.unit})</Label>
                <Input type="number" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} />
              </div>
              <div className="text-sm flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-bold">₹{(Number(restockQty) || 0) * restockTarget.costPerUnit}</span>
              </div>
              <Button className="w-full" onClick={handleRestock}>Confirm Restock</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "primary" }: any) {
  const bg = tone === "destructive" ? "bg-destructive/10" : tone === "accent" ? "bg-accent/10" : "bg-primary/10";
  const fg = tone === "destructive" ? "text-destructive" : tone === "accent" ? "text-accent" : "text-primary";
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${fg}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
