import { useState } from "react";
import { Plus, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TableStatus = "free" | "busy" | "bill";

interface RestaurantTable {
  id: string;
  label: string;
  seats: number;
  status: TableStatus;
}

const initialTables: RestaurantTable[] = [
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
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [filter, setFilter] = useState<FilterType>("all");
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
    const newTable: RestaurantTable = {
      id: newLabel.toLowerCase().replace(/\s+/g, "-"),
      label: newLabel.trim(),
      seats: parseInt(newSeats) || 4,
      status: "free",
    };
    setTables([...tables, newTable]);
    setNewLabel("");
    setNewSeats("4");
    setAddDialogOpen(false);
  };

  const handleTakeOrder = (tableId: string) => {
    setTables(tables.map((t) => (t.id === tableId ? { ...t, status: "busy" as TableStatus } : t)));
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tables</h1>
          <p className="text-sm text-muted-foreground">Restaurant table management</p>
        </div>
        <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Table
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
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

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((table) => {
          const cfg = statusConfig[table.status];
          return (
            <Card
              key={table.id}
              className={`border-2 transition-colors hover:shadow-md ${cfg.color}`}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <Badge variant="outline" className={`text-xs ${cfg.badgeCls}`}>
                  {cfg.label}
                </Badge>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{table.label}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" /> {table.seats} seats
                  </p>
                </div>
                {table.status === "free" && (
                  <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    onClick={() => handleTakeOrder(table.id)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Take Order
                  </Button>
                )}
                {table.status === "busy" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs text-muted-foreground"
                    disabled
                  >
                    In Progress
                  </Button>
                )}
                {table.status === "bill" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() =>
                      setTables(
                        tables.map((t) =>
                          t.id === table.id ? { ...t, status: "free" } : t
                        )
                      )
                    }
                  >
                    Clear Table
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Table Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>Add a new table to your restaurant layout.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="table-label">Table Name</Label>
              <Input
                id="table-label"
                placeholder="e.g. D6, VIP 3, P3"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table-seats">Seats</Label>
              <Select value={newSeats} onValueChange={setNewSeats}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8, 10, 12].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTable}>Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
