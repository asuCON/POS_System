import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationProvider } from "@/contexts/NotificationContext.tsx";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index.tsx";
import Tables from "./pages/Tables.tsx";
import Orders from "./pages/Orders.tsx";
import Menu from "./pages/Menu.tsx";
import Billing from "./pages/Billing.tsx";
import Wallet from "./pages/Wallet.tsx";
import Expenses from "./pages/Expenses.tsx";
import Inventory from "./pages/Inventory.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
