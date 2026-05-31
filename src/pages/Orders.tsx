import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/contexts/NotificationContext";
import { useData, Order, OrderStatus, PaymentMethod } from "@/contexts/DataContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Receipt, LayoutGrid, LayoutList, ShoppingBag, DollarSign,
  Clock, XCircle, Filter, Search, Eye, ChefHat, Bell, CheckCheck,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  preparing: { label: "Preparing", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  ready: { label: "Ready", color: "bg-primary/15 text-primary border-primary/30" },
  served: { label: "Served", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  billed: { label: "Paid", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive border-destructive/30" },
};

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Orders = () => {
  const { orders, setOrderStatus, cancelOrder, payOrder } = useData();
  const { addNotification } = useNotifications();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [payOrderObj, setPayOrderObj] = useState<Order | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("cash");
  const [discount, setDiscount] = useState("0");

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSearchParams({}, { replace: true });
      navigate("/menu");
    }
  }, [searchParams, setSearchParams, navigate]);

  const tableFilter = searchParams.get("table");

  const filtered = orders.filter((o) => {
    if (tableFilter && o.table !== tableFilter) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.table.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todays = orders.filter((o) => o.createdAt >= todayStart.getTime());
  const todaysTotal = todays.length;
  const revenue = todays.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "preparing" || o.status === "ready").length;
  const cancelled = todays.filter((o) => o.status === "cancelled").length;

  const stats = [
    { label: "Orders", sublabel: "Today's total", value: todaysTotal, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue", sublabel: "Today's earning", value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
    { label: "Pending", sublabel: pending === 0 ? "All caught up!" : `${pending} active`, value: pending, icon: Clock, color: "text-amber-500" },
    { label: "Cancelled", sublabel: "Today's total", value: cancelled, icon: XCircle, color: "text-destructive" },
  ];

  const advance = (o: Order) => {
    const next: Record<OrderStatus, OrderStatus | null> = {
      preparing: "ready", ready: "served", served: "billed", billed: null, cancelled: null,
    };
    const n = next[o.status];
    if (!n) return;
    if (n === "billed") { setPayOrderObj(o); return; }
    setOrderStatus(o.id, n);
    if (n === "ready") addNotification("order", "Order Ready", `${o.id} ready for Table ${o.table}`);
    toast.success(`Order ${o.id} → ${statusConfig[n].label}`);
  };

  const handlePay = () => {
    if (!payOrderObj) return;
    const bill = payOrder(payOrderObj.id, payMethod, Number(discount) || 0);
    if (bill) {
      toast.success(`Bill ${bill.billNumber} · ₹${bill.total}`);
      addNotification("payment", "Payment Received", `${bill.billNumber} for Table ${bill.table}`);
    }
    setPayOrderObj(null);
    setDiscount("0");
    setPayMethod("cash");
  };

  const actionLabel = (s: OrderStatus) =>
    ({ preparing: "Mark Ready", ready: "Mark Served", served: "Generate Bill", billed: "Paid", cancelled: "Cancelled" }[s]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {tableFilter ? `Showing orders for Table ${tableFilter}` : "Real-time order management"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button className="gap-2" onClick={() => navigate("/menu")}>
            <Plus className="w-4 h-4" /> New Order
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/billing")}>
            <Receipt className="w-4 h-4" /> Billing
          </Button>
          {tableFilter && (
            <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>Clear filter</Button>
          )}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("table")} className={`p-2 transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
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
            <SelectItem value="billed">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Order Management ({filtered.length})</h2>

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
                    <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {item.name} × {item.qty}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-bold text-foreground">₹{order.total}</span>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Order {order.id}</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-muted-foreground">Table</span><span className="font-medium">{order.table}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className={`${statusConfig[order.status].color} border`}>{statusConfig[order.status].label}</Badge></div>
                            <div className="border-t pt-3">
                              <p className="font-medium mb-2">Items</p>
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">• {item.name} × {item.qty}</span>
                                  <span>₹{item.price * item.qty}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>Total</span><span>₹{order.total}</span></div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {order.status !== "billed" && order.status !== "cancelled" && (
                        <>
                          <Button size="sm" variant="default" className="text-xs gap-1" onClick={() => advance(order)}>
                            {order.status === "preparing" && <ChefHat className="w-3 h-3" />}
                            {order.status === "ready" && <Bell className="w-3 h-3" />}
                            {order.status === "served" && <Receipt className="w-3 h-3" />}
                            {actionLabel(order.status)}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => { cancelOrder(order.id); toast.success(`Order ${order.id} cancelled`); }}>
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                      {order.status === "billed" && <CheckCheck className="w-4 h-4 text-emerald-500" />}
                    </div>
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
                      <td className="p-3 text-muted-foreground">{order.items.map((i) => `${i.name}×${i.qty}`).join(", ")}</td>
                      <td className="p-3 font-medium">₹{order.total}</td>
                      <td className="p-3">
                        <Badge className={`${statusConfig[order.status].color} border text-xs`}>{statusConfig[order.status].label}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{timeAgo(order.createdAt)}</td>
                      <td className="p-3">
                        {order.status !== "billed" && order.status !== "cancelled" ? (
                          <Button size="sm" variant="default" className="text-xs" onClick={() => advance(order)}>{actionLabel(order.status)}</Button>
                        ) : (
                          <span className="text-xs text-muted-foreground capitalize">{order.status}</span>
                        )}
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

      {/* Pay dialog */}
      <Dialog open={!!payOrderObj} onOpenChange={(o) => !o && setPayOrderObj(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Bill — {payOrderObj?.id}</DialogTitle></DialogHeader>
          {payOrderObj && (
            <div className="space-y-4">
              <div className="space-y-1 text-sm">
                {payOrderObj.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{it.name} × {it.qty}</span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between"><span>Subtotal</span><span>₹{payOrderObj.total}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax (13%)</span><span>₹{Math.round(payOrderObj.total * 0.13)}</span></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="esewa">eSewa</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Discount (₹)</label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOrderObj(null)}>Cancel</Button>
            <Button onClick={handlePay}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
