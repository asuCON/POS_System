import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Receipt,
  Eye,
  Printer,
  Clock,
  Plus,
  Search,
  ArrowLeft,
  IndianRupee,
  FileText,
  Percent,
  Tag,
} from "lucide-react";

type PaymentMethod = "cash" | "esewa" | "bank_transfer" | "card";
type PrintStatus = "printed" | "not_printed";

interface BillItem {
  name: string;
  qty: number;
  price: number;
}

interface Bill {
  id: string;
  billNumber: string;
  table: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  printStatus: PrintStatus;
  createdAt: Date;
}

const tables = ["D1", "D2", "D3", "D4", "P1", "P2", "T1", "VIP 1", "VIP 2"];

const generateBills = (): Bill[] => {
  const methods: PaymentMethod[] = ["cash", "esewa", "bank_transfer", "card"];
  const itemNames = ["Masala Chai", "Momo", "Biryani", "Samosa", "Lassi", "Naan", "Paneer Tikka", "Dal Makhani"];
  const bills: Bill[] = [];

  for (let i = 0; i < 15; i++) {
    const items: BillItem[] = [];
    const numItems = Math.floor(Math.random() * 4) + 1;
    let subtotal = 0;
    for (let j = 0; j < numItems; j++) {
      const price = Math.floor(Math.random() * 300) + 50;
      const qty = Math.floor(Math.random() * 3) + 1;
      items.push({ name: itemNames[Math.floor(Math.random() * itemNames.length)], qty, price });
      subtotal += price * qty;
    }
    const tax = Math.round(subtotal * 0.13);
    const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;

    bills.push({
      id: `bill-${i}`,
      billNumber: `BILL-${433354 + i}`,
      table: tables[Math.floor(Math.random() * tables.length)],
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      printStatus: Math.random() > 0.4 ? "printed" : "not_printed",
      createdAt: new Date(2026, 3, Math.floor(Math.random() * 7) + 1, Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 60)),
    });
  }
  return bills.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const paymentLabel = (m: PaymentMethod) => {
  const map: Record<PaymentMethod, string> = { cash: "Cash", esewa: "eSewa", bank_transfer: "Bank Transfer", card: "Card" };
  return map[m];
};

export default function Billing() {
  const [bills] = useState<Bill[]>(generateBills);
  const [showManagement, setShowManagement] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  if (showManagement) {
    return <BillingManagement bills={bills} onBack={() => setShowManagement(false)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted-foreground text-sm">Process customer payments and generate bills</p>
      </div>

      {/* Timer + View Bills */}
      <div className="flex items-center gap-4">
        <Button onClick={() => setShowManagement(true)} className="bg-primary text-primary-foreground">
          <Eye className="h-4 w-4 mr-2" />
          View Bills
        </Button>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono text-lg font-semibold text-foreground">{formatTime()}</span>
        </div>
      </div>

      {/* Recent Bills */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Bills</h2>
        <div className="space-y-3">
          {bills.slice(0, 8).map((bill) => (
            <Card key={bill.id} className="border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Bill #{bill.billNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Table {bill.table} • {bill.createdAt.toLocaleDateString()}, {bill.createdAt.toLocaleTimeString()} • {paymentLabel(bill.paymentMethod)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground text-lg">₹{bill.total}</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedBill(bill)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bill Detail Dialog */}
      <BillDetailDialog bill={selectedBill} onClose={() => setSelectedBill(null)} />
    </div>
  );
}

/* ─── Billing Management Sub-page ─── */

function BillingManagement({ bills, onBack }: { bills: Bill[]; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);
  const totalTax = bills.reduce((s, b) => s + b.tax, 0);
  const totalDiscount = bills.reduce((s, b) => s + b.discount, 0);

  const filtered = bills.filter((b) => {
    if (search && !b.billNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (paymentFilter !== "all" && b.paymentMethod !== paymentFilter) return false;
    if (tableFilter !== "all" && b.table !== tableFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Billing Management</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-11">View all bills, track payments and generate billing reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create New Bill
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bills</p>
              <p className="text-xl font-bold text-foreground">{bills.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Percent className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tax</p>
              <p className="text-xl font-bold text-foreground">₹{totalTax.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Discount</p>
              <p className="text-xl font-bold text-foreground">₹{totalDiscount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by bill number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Types</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="esewa">eSewa</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tableFilter} onValueChange={setTableFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Bills ({filtered.length})</h2>
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Bill Number</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Print Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.billNumber}</TableCell>
                  <TableCell>{bill.table}</TableCell>
                  <TableCell>₹{bill.subtotal}</TableCell>
                  <TableCell>₹{bill.tax}</TableCell>
                  <TableCell>₹{bill.discount}</TableCell>
                  <TableCell className="font-bold">₹{bill.total}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{paymentLabel(bill.paymentMethod)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={bill.printStatus === "printed" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {bill.printStatus === "printed" ? "Printed" : "Not Printed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {bill.createdAt.toLocaleDateString()}, {bill.createdAt.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedBill(bill)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <BillDetailDialog bill={selectedBill} onClose={() => setSelectedBill(null)} />
    </div>
  );
}

/* ─── Bill Detail Dialog ─── */

function BillDetailDialog({ bill, onClose }: { bill: Bill | null; onClose: () => void }) {
  if (!bill) return null;
  return (
    <Dialog open={!!bill} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bill #{bill.billNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Table {bill.table}</span>
            <span>{bill.createdAt.toLocaleDateString()}, {bill.createdAt.toLocaleTimeString()}</span>
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            {bill.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} x{item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{bill.subtotal}</span></div>
            <div className="flex justify-between"><span>Tax (13%)</span><span>₹{bill.tax}</span></div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-destructive"><span>Discount</span><span>-₹{bill.discount}</span></div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
              <span>Total</span><span>₹{bill.total}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <Badge variant="secondary">{paymentLabel(bill.paymentMethod)}</Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-primary text-primary-foreground">
              <Printer className="h-4 w-4 mr-2" /> Print Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
