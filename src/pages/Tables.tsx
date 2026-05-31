import { useState } from "react";
import { Plus, Users, ShoppingCart, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { useData, TableStatus } from "@/contexts/DataContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<TableStatus, { label: string; color: string; badgeCls: string }> = {
  free: {
    label: "Free",
    color: "border-primary/40 bg-primary/5",
    badgeCls: "bg-primary/15 text-primary border-primary/30",
  },
  busy: {
    label: "Occupied",
    color: "border-destructive/40 bg-destructive/5",
    badgeCls: "bg-destructive/15 text-destructive border-destructive/30",
  },
  bill: {
    label: "Bill",
    color: "border-yellow-500/40 bg-yellow-500/5",
    badgeCls: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  },
};

type FilterType = "all" | TableStatus;

const Tables = () => {
  const { tables, addTable, setTableStatus, orders, payOrder } = useData();
  const [filter, setFilter] = useState<FilterType>("all");
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSeats, setNewSeats] = useState("4");

  const filtered = filter === "all" ? tables : tables.filter((t) => t.status === filter);

  const counts = {
    all: tables.length,
    free: tables.filter((t) => t.status === "free").length,
    busy: tables.filter((t) => t.status === "busy").length,
    bill: tables.filter((t) => t.status === "bill").length,
  };

  const handleAddTable = () => {
    if (!newLabel.trim()) return;
    addTable(newLabel.trim(), parseInt(newSeats) || 4);
    addNotification("table", "Table Added", `New table ${newLabel.trim()} added`);
    toast.success(`Table ${newLabel.trim()} added`);
    setNewLabel("");
    setNewSeats("4");
    setAddDialogOpen(false);
  };

  const handleTakeOrder = (label: string) => {
    navigate(`/menu?table=${encodeURIComponent(label)}`);
  };

  const handleSettleBill = (label: string) => {
    const tableOrder = orders.find((o) => o.table === label && (o.status === "served" || o.status === "ready" || o.status === "preparing"));
    if (!tableOrder) {
      // No order—just free the table
      const tbl = tables.find((t) => t.label === label);
      if (tbl) setTableStatus(tbl.id, "free");
      toast.success(`Table ${label} cleared`);
      addNotification("table", "Table Cleared", `Table ${label} has been cleared`);
      return;
    }
    const bill = payOrder(tableOrder.id, "cash");
    if (bill) {
      toast.success(`Bill ${bill.billNumber} paid · ₹${bill.total}`);
      addNotification("payment", "Payment Received", `Bill ${bill.billNumber} for Table ${label}`);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tables</h1>
          <p className="text-sm text-muted-foreground">Restaurant table management</p>
        </div>
        <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Table
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "free", "busy", "bill"] as FilterType[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === "all" ? "All" : statusConfig[f].label} ({counts[f]})
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((table) => {
          const cfg = statusConfig[table.status];
          return (
            <Card key={table.id} className={`border-2 transition-colors hover:shadow-md ${cfg.color}`}>
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <Badge variant="outline" className={`text-xs ${cfg.badgeCls}`}>{cfg.label}</Badge>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{table.label}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" /> {table.seats} seats
                  </p>
                </div>
                {table.status === "free" && (
                  <Button size="sm" className="w-full gap-1.5 text-xs" onClick={() => handleTakeOrder(table.label)}>
                    <ShoppingCart className="h-3.5 w-3.5" /> Take Order
                  </Button>
                )}
                {table.status === "busy" && (
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate(`/orders?table=${encodeURIComponent(table.label)}`)}>
                    View Order
                  </Button>
                )}
                {table.status === "bill" && (
                  <Button size="sm" variant="secondary" className="w-full text-xs gap-1.5" onClick={() => handleSettleBill(table.label)}>
                    <Receipt className="h-3.5 w-3.5" /> Settle Bill
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>Add a new table to your restaurant layout.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="table-label">Table Name</Label>
              <Input id="table-label" placeholder="e.g. D6, VIP 3, P3" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table-seats">Seats</Label>
              <Select value={newSeats} onValueChange={setNewSeats}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8, 10, 12].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} seats</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTable}>Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
