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
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, TrendingUp, Search,
  Download, CreditCard, Banknote, Smartphone, IndianRupee, Calendar,
} from "lucide-react";
import { useData, TxChannel } from "@/contexts/DataContext";
import { toast } from "sonner";

const channelIcon = (ch: TxChannel) => {
  switch (ch) {
    case "cash": return <Banknote className="h-4 w-4" />;
    case "esewa": return <Smartphone className="h-4 w-4" />;
    case "bank": return <IndianRupee className="h-4 w-4" />;
    case "card": return <CreditCard className="h-4 w-4" />;
  }
};

const channelLabel = (ch: TxChannel) =>
  ({ cash: "Cash", esewa: "eSewa", bank: "Bank", card: "Card" }[ch]);

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Wallet() {
  const { transactions } = useData();
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

  const handleExport = () => {
    downloadCSV("transactions.csv", [
      ["Description", "Reference", "Type", "Channel", "Amount", "Date"],
      ...filtered.map((t) => [t.description, t.reference, t.type, channelLabel(t.channel), t.amount, new Date(t.date).toLocaleString()]),
    ]);
    toast.success("Transactions exported");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground text-sm">Track all income, expenses and refunds</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={WalletIcon} label="Balance" value={`₹${balance.toLocaleString()}`} color="text-foreground" />
        <StatCard icon={ArrowDownLeft} label="Total Income" value={`₹${totalIncome.toLocaleString()}`} color="text-primary" />
        <StatCard icon={ArrowUpRight} label="Total Expenses" value={`₹${totalExpense.toLocaleString()}`} color="text-destructive" tone="destructive" />
        <StatCard icon={TrendingUp} label="Refunds" value={`₹${totalRefunds.toLocaleString()}`} color="text-foreground" tone="accent" />
      </div>

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
                    >{txn.type}</Badge>
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
                      {new Date(txn.date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transactions</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
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
