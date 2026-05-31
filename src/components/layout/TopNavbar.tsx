import { Bell, Moon, Sun, User, ShoppingBag, CreditCard, UtensilsCrossed, Package, Info, Check, CheckCheck, Trash2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifIcon: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingBag className="h-4 w-4 text-primary" />,
  payment: <CreditCard className="h-4 w-4 text-accent" />,
  table: <UtensilsCrossed className="h-4 w-4 text-amber-500" />,
  stock: <Package className="h-4 w-4 text-destructive" />,
  system: <Info className="h-4 w-4 text-muted-foreground" />,
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TopNavbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
      document.documentElement.classList.add("dark");
      return "dark";
    }
    return "dark";
  });

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-card border-b border-border shrink-0 fixed top-0 left-0 right-0 z-50">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-foreground" />
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="चिया कि Cheers" className="h-8 w-8 rounded-full object-cover" />
          <h1 className="text-lg font-bold text-foreground">चिया कि Cheers</h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 text-sm">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </DropdownMenuLabel>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={(e) => { e.preventDefault(); markAllAsRead(); }}>
                    <CheckCheck className="h-3 w-3" /> Read all
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={(e) => { e.preventDefault(); clearAll(); }}>
                    <Trash2 className="h-3 w-3" /> Clear
                  </Button>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-[320px]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer ${!notif.read ? "bg-primary/5" : ""}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="mt-0.5 shrink-0">{notifIcon[notif.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{notif.title}</p>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(notif.time)}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">Sudip Bishwokarma</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-destructive">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
