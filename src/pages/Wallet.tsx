import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Search,
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  IndianRupee,
  Calendar,
} from "lucide-react";

type TransactionType = "income" | "expense" | "refund";
type PaymentChannel = "cash" | "esewa" | "bank" | "card";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  channel: PaymentChannel;
  date: Date;
  reference: string;
}

const generateTransactions = (): Transaction[] => {
  const descriptions = {
    income: ["Table D1 Bill Payment", "Table VIP 1 Settlement", "Table P2 Order", "Takeaway Order", "Table D3 Payment", "Catering Payment"],
    expense: ["Grocery Supply Purchase", "Staff Salary - Ram", "Electricity Bill", "Gas Cylinder Refill", "Cleaning Supplies", "Equipment Repair"],
    refund: ["Order #1032 Refund", "Wrong Order Refund", "Customer Complaint Refund"],
  };
  const channels: PaymentChannel[] = ["cash", "esewa", "bank", "card"];
  const txns: Transaction[] = [];

  for (let i = 0; i < 20; i++) {
    const type: TransactionType = i < 12 ? "income" : i < 18 ? "expense" : "refund";
    const descs = descriptions[type];
    const amount = type === "income"
      ? Math.floor(Math.random() * 3000) + 500
      : type === "expense"
        ? Math.floor(Math.random() * 5000) + 200
        : Math.floor(Math.random() * 500) + 100;

    txns.push({
      id: `txn-${i}`,
      description: descs[Math.floor(Math.random() * descs.length)],
      amount,
      type,
      channel: channels[Math.floor(Math.random() * channels.length)],
      date: new Date(2026, 3, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60)),
      reference: `TXN-${100000 + i}`,
    });
  }
  return txns.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const channelIcon = (ch: PaymentChannel) => {
  switch (ch) {
    case "cash": return <Banknote className="h-4 w-4" />;
    case "esewa": return <Smartphone className="h-4 w-4" />;
    case "bank": return <IndianRupee className="h-4 w-4" />;
    case "card": return <CreditCard className="h-4 w-4" />;
  }
};

const channelLabel = (ch: PaymentChannel) =>
  ({ cash: "Cash", esewa: "eSewa", bank: "Bank", card: "Card" })[ch];

export default function Wallet() {
  const [transactions] = useState<Transaction[]>(generateTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalRefunds = transactions.filter((t) => t.type === "refund").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense - totalRefunds;

  const filtered = transactions.filter((t) => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.reference.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (channelFilter !== "all" && t.channel !== channelFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground text-sm">Track all income, expenses and refunds</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <WalletIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-xl font-bold text-foreground">₹{balance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold text-primary">₹{totalIncome.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold text-destructive">₹{totalExpense.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refunds</p>
              <p className="text-xl font-bold text-foreground">₹{totalRefunds.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Channel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="esewa">eSewa</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Transactions ({filtered.length})</h2>
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{txn.reference}</TableCell>
                  <TableCell>
                    <Badge
                      variant={txn.type === "income" ? "default" : txn.type === "expense" ? "destructive" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      {channelIcon(txn.channel)}
                      <span>{channelLabel(txn.channel)}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`font-bold ${txn.type === "income" ? "text-primary" : "text-destructive"}`}>
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {txn.date.toLocaleDateString()}, {txn.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
