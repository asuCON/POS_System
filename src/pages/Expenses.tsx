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
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingDown,
  Plus,
  Search,
  ShoppingCart,
  Zap,
  Users,
  Wrench,
  Truck,
  IndianRupee,
  Calendar,
  PieChart,
} from "lucide-react";

type ExpenseCategory = "supplies" | "utilities" | "salary" | "maintenance" | "delivery" | "other";

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  paidBy: string;
  receipt: boolean;
}

const categoryConfig: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string }> = {
  supplies: { label: "Supplies", icon: <ShoppingCart className="h-4 w-4" />, color: "bg-primary/10 text-primary" },
  utilities: { label: "Utilities", icon: <Zap className="h-4 w-4" />, color: "bg-accent/10 text-accent" },
  salary: { label: "Salary", icon: <Users className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-600" },
  maintenance: { label: "Maintenance", icon: <Wrench className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-600" },
  delivery: { label: "Delivery", icon: <Truck className="h-4 w-4" />, color: "bg-orange-500/10 text-orange-600" },
  other: { label: "Other", icon: <IndianRupee className="h-4 w-4" />, color: "bg-muted text-muted-foreground" },
};

const paidByOptions = ["Ram", "Shyam", "Hari", "Sita", "Owner"];

const generateExpenses = (): Expense[] => {
  const items: { title: string; category: ExpenseCategory; range: [number, number] }[] = [
    { title: "Vegetable Purchase", category: "supplies", range: [500, 3000] },
    { title: "Rice & Flour Stock", category: "supplies", range: [2000, 8000] },
    { title: "Cooking Oil", category: "supplies", range: [800, 2500] },
    { title: "Spices Restocking", category: "supplies", range: [300, 1500] },
    { title: "Electricity Bill - April", category: "utilities", range: [3000, 8000] },
    { title: "Water Bill", category: "utilities", range: [500, 1500] },
    { title: "Internet Bill", category: "utilities", range: [1000, 2000] },
    { title: "Gas Cylinder x3", category: "utilities", range: [2000, 4000] },
    { title: "Staff Salary - Ram", category: "salary", range: [12000, 18000] },
    { title: "Staff Salary - Shyam", category: "salary", range: [10000, 15000] },
    { title: "Part-time Helper", category: "salary", range: [5000, 8000] },
    { title: "AC Repair", category: "maintenance", range: [2000, 5000] },
    { title: "Plumbing Fix", category: "maintenance", range: [500, 2000] },
    { title: "Delivery Partner Fee", category: "delivery", range: [1000, 3000] },
    { title: "Packaging Materials", category: "delivery", range: [500, 1500] },
    { title: "Miscellaneous", category: "other", range: [200, 1000] },
  ];

  return items.map((item, i) => ({
    id: `exp-${i}`,
    title: item.title,
    description: `Payment for ${item.title.toLowerCase()}`,
    amount: Math.floor(Math.random() * (item.range[1] - item.range[0])) + item.range[0],
    category: item.category,
    date: new Date(2026, 3, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 8),
    paidBy: paidByOptions[Math.floor(Math.random() * paidByOptions.length)],
    receipt: Math.random() > 0.3,
  })).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(generateExpenses);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("supplies");
  const [newDescription, setNewDescription] = useState("");

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonthExpenses = expenses.filter((e) => e.date.getMonth() === 3).reduce((s, e) => s + e.amount, 0);
  const categoryTotals = Object.entries(categoryConfig).map(([key, config]) => ({
    key,
    ...config,
    total: expenses.filter((e) => e.category === key).reduce((s, e) => s + e.amount, 0),
  }));
  const topCategory = categoryTotals.sort((a, b) => b.total - a.total)[0];

  const filtered = expenses.filter((e) => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && e.category !== catFilter) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newTitle || !newAmount) return;
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      amount: Number(newAmount),
      category: newCategory,
      date: new Date(),
      paidBy: "Owner",
      receipt: false,
    };
    setExpenses((prev) => [expense, ...prev]);
    setNewTitle("");
    setNewAmount("");
    setNewDescription("");
    setShowAdd(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground text-sm">Track and manage all restaurant expenses</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold text-foreground">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold text-foreground">₹{thisMonthExpenses.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-xl font-bold text-foreground">{topCategory?.label}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg / Expense</p>
              <p className="text-xl font-bold text-foreground">₹{Math.round(totalExpenses / expenses.length).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categoryTotals.map((cat) => (
          <Card
            key={cat.key}
            className={`border-border cursor-pointer transition-colors ${catFilter === cat.key ? "ring-2 ring-primary" : ""}`}
            onClick={() => setCatFilter(catFilter === cat.key ? "all" : cat.key)}
          >
            <CardContent className="p-3 text-center">
              <div className={`h-8 w-8 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-1.5`}>
                {cat.icon}
              </div>
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <p className="text-sm font-bold text-foreground">₹{cat.total.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expenses Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">All Expenses ({filtered.length})</h2>
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exp) => {
                const cat = categoryConfig[exp.category];
                return (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">{exp.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded ${cat.color}`}>{cat.icon}</span>
                        <span className="text-sm">{cat.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-destructive">₹{exp.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{exp.paidBy}</TableCell>
                    <TableCell>
                      <Badge variant={exp.receipt ? "default" : "outline"} className="text-xs">
                        {exp.receipt ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {exp.date.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Vegetable Purchase" />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={(v) => setNewCategory(v as ExpenseCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Optional notes..." />
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
