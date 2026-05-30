import { 
  ClipboardList, Receipt, UtensilsCrossed, BookOpen, Package, 
  Plus, ArrowRight, TrendingUp, Users, BarChart3, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusCards = [
  { label: "Available", value: 8, color: "bg-primary", textColor: "text-primary" },
  { label: "Occupied", value: 5, color: "bg-accent", textColor: "text-accent" },
  { label: "Pending", value: 3, color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "Cooking", value: 4, color: "bg-destructive", textColor: "text-destructive" },
];

const quickAccess = [
  { label: "Orders", icon: ClipboardList, url: "/orders" },
  { label: "Billing", icon: Receipt, url: "/billing" },
  { label: "Tables", icon: UtensilsCrossed, url: "/tables" },
  { label: "Menu", icon: BookOpen, url: "/menu" },
  { label: "Inventory", icon: Package, url: "/inventory" },
];

const usageOverview = [
  { label: "Monthly Orders", value: "1,284", change: "+12%", icon: ClipboardList },
  { label: "Monthly Bills", value: "$48,520", change: "+8%", icon: Receipt },
  { label: "Users", value: "32", change: "+3", icon: Users },
  { label: "Tables", value: "20", change: "Full capacity", icon: UtensilsCrossed },
];

const tables = [
  { id: 1, seats: 4, status: "available" },
  { id: 2, seats: 2, status: "occupied" },
  { id: 3, seats: 6, status: "occupied" },
  { id: 4, seats: 4, status: "available" },
  { id: 5, seats: 2, status: "pending" },
  { id: 6, seats: 8, status: "cooking" },
  { id: 7, seats: 4, status: "available" },
  { id: 8, seats: 2, status: "occupied" },
];

const recentOrders = [
  { id: "#1042", table: "Table 3", items: 4, total: "$42.50", time: "2 min ago", status: "Cooking" },
  { id: "#1041", table: "Table 6", items: 2, total: "$18.00", time: "8 min ago", status: "Served" },
  { id: "#1040", table: "Table 2", items: 6, total: "$67.20", time: "15 min ago", status: "Served" },
  { id: "#1039", table: "Table 5", items: 3, total: "$31.00", time: "22 min ago", status: "Paid" },
  { id: "#1038", table: "Table 1", items: 5, total: "$55.80", time: "30 min ago", status: "Paid" },
];

const statusColorMap: Record<string, string> = {
  available: "bg-primary/15 text-primary border-primary/20",
  occupied: "bg-accent/15 text-accent border-accent/20",
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
  cooking: "bg-destructive/15 text-destructive border-destructive/20",
};

const orderStatusBadge: Record<string, string> = {
  Cooking: "bg-destructive/15 text-destructive",
  Served: "bg-primary/15 text-primary",
  Paid: "bg-muted text-muted-foreground",
};

const Index = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Admin</h1>
          <p className="text-muted-foreground text-sm">Here's your restaurant overview</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Order
          </Button>
          <Button variant="outline" className="gap-2">
            <UtensilsCrossed className="h-4 w-4" /> Tables
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {quickAccess.map((item) => (
            <Card key={item.label} className="hover:border-primary/40 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage Overview */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Usage Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usageOverview.map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-primary font-medium">{item.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tables Status & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tables Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tables Status</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className={`rounded-lg border p-3 text-center ${statusColorMap[t.status]}`}
                >
                  <p className="text-xs font-medium">T{t.id}</p>
                  <p className="text-[10px] opacity-70">{t.seats} seats</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              {Object.entries(statusColorMap).map(([status]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    status === "available" ? "bg-primary" :
                    status === "occupied" ? "bg-accent" :
                    status === "pending" ? "bg-yellow-500" : "bg-destructive"
                  }`} />
                  <span className="text-[10px] text-muted-foreground capitalize">{status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.id} · {order.table}</p>
                      <p className="text-xs text-muted-foreground">{order.items} items · {order.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <Badge className={`text-[10px] border-0 ${orderStatusBadge[order.status]}`}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
