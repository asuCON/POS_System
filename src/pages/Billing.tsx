import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Eye, Printer, Clock, Plus, Search, ArrowLeft, IndianRupee, FileText, Percent, Tag, Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, Bill, PaymentMethod } from "@/contexts/DataContext";
import { toast } from "sonner";

const paymentLabel = (m: PaymentMethod) =>
  ({ cash: "Cash", esewa: "eSewa", bank_transfer: "Bank Transfer", card: "Card" }[m]);

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Billing() {
  const { bills, markBillPrinted } = useData();
  const navigate = useNavigate();
  const [showManagement, setShowManagement] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = (b: Bill) => {
    markBillPrinted(b.id);
    toast.success(`Bill ${b.billNumber} sent to printer`);
  };

  if (showManagement) {
    return <BillingManagement bills={bills} onBack={() => setShowManagement(false)} onPrint={handlePrint} onSelect={setSelectedBill} selectedBill={selectedBill} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted-foreground text-sm">Process customer payments and generate bills</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={() => setShowManagement(true)} className="bg-primary text-primary-foreground">
          <Eye className="h-4 w-4 mr-2" /> View Bills
        </Button>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          <Plus className="h-4 w-4 mr-2" /> Create Bill (from Order)
        </Button>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono text-lg font-semibold text-foreground">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Bills</h2>
        <div className="space-y-3">
          {bills.slice(0, 8).map((bill) => (
            <Card key={bill.id} className="border-border">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Bill #{bill.billNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Table {bill.table} • {new Date(bill.createdAt).toLocaleString()} • {paymentLabel(bill.paymentMethod)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground text-lg">₹{bill.total}</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedBill(bill)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handlePrint(bill)}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {bills.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No bills yet — process an order to create one.</p>
          )}
        </div>
      </div>

      <BillDetailDialog bill={selectedBill} onClose={() => setSelectedBill(null)} onPrint={handlePrint} />
    </div>
  );
}

function BillingManagement({ bills, onBack, onPrint, onSelect, selectedBill }: { bills: Bill[]; onBack: () => void; onPrint: (b: Bill) => void; onSelect: (b: Bill | null) => void; selectedBill: Bill | null }) {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");

  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);
  const totalTax = bills.reduce((s, b) => s + b.tax, 0);
  const totalDiscount = bills.reduce((s, b) => s + b.discount, 0);

  const allTables = Array.from(new Set(bills.map((b) => b.table)));

  const filtered = bills.filter((b) => {
    if (search && !b.billNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (paymentFilter !== "all" && b.paymentMethod !== paymentFilter) return false;
    if (tableFilter !== "all" && b.table !== tableFilter) return false;
    return true;
  });

  const handleExport = () => {
    downloadCSV("bills.csv", [
      ["Bill", "Table", "Subtotal", "Tax", "Discount", "Total", "Payment", "Printed", "Date"],
      ...filtered.map((b) => [b.billNumber, b.table, b.subtotal, b.tax, b.discount, b.total, paymentLabel(b.paymentMethod), b.printed ? "Yes" : "No", new Date(b.createdAt).toLocaleString()]),
    ]);
    toast.success("Bills exported");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-2xl font-bold text-foreground">Billing Management</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-11">View all bills, track payments and generate billing reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Bills" value={bills.length} color="text-primary" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="text-primary" />
        <StatCard icon={Percent} label="Total Tax" value={`₹${totalTax.toLocaleString()}`} color="text-accent" />
        <StatCard icon={Tag} label="Total Discount" value={`₹${totalDiscount.toLocaleString()}`} color="text-destructive" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by bill number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Payment Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Types</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="esewa">eSewa</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tableFilter} onValueChange={setTableFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Table" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {allTables.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

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
                  <TableCell><Badge variant="secondary" className="text-xs">{paymentLabel(bill.paymentMethod)}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={bill.printed ? "default" : "outline"} className="text-xs">
                      {bill.printed ? "Printed" : "Not Printed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(bill.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onSelect(bill)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => onPrint(bill)}><Printer className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <BillDetailDialog bill={selectedBill} onClose={() => onSelect(null)} onPrint={onPrint} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BillDetailDialog({ bill, onClose, onPrint }: { bill: Bill | null; onClose: () => void; onPrint: (b: Bill) => void }) {
  if (!bill) return null;
  return (
    <Dialog open={!!bill} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Bill #{bill.billNumber}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Table {bill.table}</span>
            <span>{new Date(bill.createdAt).toLocaleString()}</span>
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
            <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => onPrint(bill)}>
              <Printer className="h-4 w-4 mr-2" /> Print Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
