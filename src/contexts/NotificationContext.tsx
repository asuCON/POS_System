import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "order" | "payment" | "table" | "stock" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};

let notifCounter = 0;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "init-1",
      type: "order",
      title: "New Order",
      message: "Order #ORD-001 received from Table D1",
      time: new Date(Date.now() - 120000),
      read: false,
    },
    {
      id: "init-2",
      type: "table",
      title: "Table Request",
      message: "Table P1 is requesting the bill",
      time: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: "init-3",
      type: "stock",
      title: "Low Stock",
      message: "Espresso beans running low (5 units left)",
      time: new Date(Date.now() - 600000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((type: NotificationType, title: string, message: string) => {
    notifCounter++;
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${notifCounter}`,
      type,
      title,
      message,
      time: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
