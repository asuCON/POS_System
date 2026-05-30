import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Receipt,
  LayoutGrid,
  LayoutList,
  ShoppingBag,
  DollarSign,
  Clock,
  XCircle,
  Filter,
  Search,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type OrderStatus = "preparing" | "ready" | "served" | "cancelled";

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
  customer?: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", table: "D1", items: ["Butter Chicken", "Naan x2", "Lassi"], total: 450, status: "preparing", time: "2 min ago" },
  { id: "ORD-002", table: "P2", items: ["Biryani", "Raita", "Gulab Jamun"], total: 380, status: "ready", time: "8 min ago" },
  { id: "ORD-003", table: "VIP 1", items: ["Paneer Tikka", "Dal Makhani", "Roti x4"], total: 620, status: "served", time: "15 min ago" },
  { id: "ORD-004", table: "T1", items: ["Chai x3", "Samosa x2"], total: 150, status: "preparing", time: "1 min ago" },
  { id: "ORD-005", table: "D3", items: ["Thali Special"], total: 280, status: "cancelled", time: "20 min ago" },
  { id: "ORD-006", table: "D2", items: ["Masala Dosa", "Filter Coffee x2"], total: 220, status: "ready", time: "5 min ago" },
  { id: "ORD-007", table: "P1", items: ["Chole Bhature", "Mango Shake"], total: 190, status: "served", time: "25 min ago" },
  { id: "ORD-008", table: "VIP 2", items: ["Tandoori Platter", "Naan x3", "Kheer"], total: 850, status: "preparing", time: "3 min ago" },
];

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  preparing: { label: "Preparing", color: "bg-amber-100 text-amber-700 border-amber-200" },
  ready: { label: "Ready", color: "bg-primary/10 text-primary border-primary/20" },
  served: { label: "Served", color: "bg-blue-100 text-blue-700 border-blue-200" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const Orders = () => {
  const [orders] = useState<Order[]>(initialOrders);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.table.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const todaysTotal = orders.length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "preparing").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const stats = [
    { label: "Orders", sublabel: "Today's total", value: todaysTotal, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue", sublabel: "Today's earning", value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
    { label: "Pending", sublabel: pending === 0 ? "All caught up!" : `${pending} in kitchen`, value: pending, icon: Clock, color: "text-amber-500" },
    { label: "Cancelled", sublabel: "Today's total", value: cancelled, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">Real-time order management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Order
          </Button>
          <Button variant="outline" className="gap-2">
            <Receipt className="w-4 h-4" /> Billing
          </Button>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="served">Served</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sublabel}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Management */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Order Management</h2>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((order) => (
              <Card key={order.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{order.id}</span>
                    <Badge className={`${statusConfig[order.status].color} border text-xs`}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded text-foreground">Table {order.table}</span>
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {item}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-bold text-foreground">₹{order.total}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order {order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Table</span>
                            <span className="font-medium">{order.table}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={`${statusConfig[order.status].color} border`}>{statusConfig[order.status].label}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time</span>
                            <span>{order.time}</span>
                          </div>
                          <div className="border-t pt-3">
                            <p className="font-medium mb-2">Items</p>
                            {order.items.map((item, i) => (
                              <p key={i} className="text-sm text-muted-foreground">• {item}</p>
                            ))}
                          </div>
                          <div className="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{order.total}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Table</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Items</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{order.id}</td>
                      <td className="p-3">{order.table}</td>
                      <td className="p-3 text-muted-foreground">{order.items.join(", ")}</td>
                      <td className="p-3 font-medium">₹{order.total}</td>
                      <td className="p-3">
                        <Badge className={`${statusConfig[order.status].color} border text-xs`}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{order.time}</td>
                      <td className="p-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Order {order.id}</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                              <div className="flex justify-between"><span className="text-muted-foreground">Table</span><span className="font-medium">{order.table}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className={`${statusConfig[order.status].color} border`}>{statusConfig[order.status].label}</Badge></div>
                              <div className="border-t pt-3"><p className="font-medium mb-2">Items</p>{order.items.map((item, i) => <p key={i} className="text-sm text-muted-foreground">• {item}</p>)}</div>
                              <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span>₹{order.total}</span></div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
