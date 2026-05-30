import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Settings as SettingsIcon,
  Bell,
  Volume2,
  Upload,
  Edit,
  Lock,
  UserPlus,
  Trash2,
  User,
  Shield,
  Mail,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@chiyakicheers.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-04-12, 10:30 AM",
  },
  {
    id: 2,
    name: "Ram Sharma",
    email: "ram@chiyakicheers.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2026-04-11, 8:15 PM",
  },
  {
    id: 3,
    name: "Sita Thapa",
    email: "sita@chiyakicheers.com",
    role: "Cashier",
    status: "Active",
    lastLogin: "2026-04-12, 7:00 AM",
  },
  {
    id: 4,
    name: "Hari Poudel",
    email: "hari@chiyakicheers.com",
    role: "Waiter",
    status: "Inactive",
    lastLogin: "2026-04-05, 3:45 PM",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [users, setUsers] = useState(initialUsers);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[0] | null>(null);

  // Restaurant settings state
  const [restaurantName, setRestaurantName] = useState("चिया कि Cheers");
  const [restaurantAddress, setRestaurantAddress] = useState("Kathmandu, Nepal");
  const [restaurantPhone, setRestaurantPhone] = useState("+977-9800000000");
  const [restaurantEmail, setRestaurantEmail] = useState("info@chiyakicheers.com");
  const [restaurantDescription, setRestaurantDescription] = useState("Authentic Nepali tea house serving the finest chiya and snacks.");
  const [taxRate, setTaxRate] = useState("13");
  const [currency, setCurrency] = useState("NPR");

  // Notification settings
  const [newOrderNotif, setNewOrderNotif] = useState(true);
  const [paymentNotif, setPaymentNotif] = useState(true);
  const [lowStockNotif, setLowStockNotif] = useState(true);
  const [dailyReportNotif, setDailyReportNotif] = useState(false);
  const [customerFeedbackNotif, setCustomerFeedbackNotif] = useState(true);
  const [staffLoginNotif, setStaffLoginNotif] = useState(false);

  // Sound settings
  const [notifSound, setNotifSound] = useState(true);
  const [orderSound, setOrderSound] = useState(true);
  const [paymentSound, setPaymentSound] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  const [soundVolume, setSoundVolume] = useState("medium");

  // New user form
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Waiter");
  const [newUserPassword, setNewUserPassword] = useState("");

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserPassword) return;
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Active",
      lastLogin: "Never",
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Waiter");
    setNewUserPassword("");
    setAddUserOpen(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin": return "default";
      case "Manager": return "secondary";
      case "Cashier": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your restaurant settings</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-4">
          {/* Restaurant Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restaurant Settings</CardTitle>
              <CardDescription>Change your restaurant information, logo, and name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Restaurant Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Change Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={restaurantEmail} onChange={(e) => setRestaurantEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NPR">NPR (रू)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={restaurantDescription}
                  onChange={(e) => setRestaurantDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New Order Notifications", desc: "Get notified when a new order is placed", value: newOrderNotif, setter: setNewOrderNotif },
                { label: "Payment Notifications", desc: "Get notified on successful payments", value: paymentNotif, setter: setPaymentNotif },
                { label: "Low Stock Alerts", desc: "Get notified when inventory items are running low", value: lowStockNotif, setter: setLowStockNotif },
                { label: "Daily Report", desc: "Receive a daily summary report", value: dailyReportNotif, setter: setDailyReportNotif },
                { label: "Customer Feedback", desc: "Get notified on new customer feedback", value: customerFeedbackNotif, setter: setCustomerFeedbackNotif },
                { label: "Staff Login Alerts", desc: "Get notified when staff members log in", value: staffLoginNotif, setter: setStaffLoginNotif },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sound Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Notification Sound
              </CardTitle>
              <CardDescription>Configure notification sound preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Notification Sound", desc: "Play sound for all notifications", value: notifSound, setter: setNotifSound },
                { label: "Order Alert Sound", desc: "Play sound when a new order arrives", value: orderSound, setter: setOrderSound },
                { label: "Payment Sound", desc: "Play sound on successful payment", value: paymentSound, setter: setPaymentSound },
                { label: "Alert Sound", desc: "Play sound for critical alerts", value: alertSound, setter: setAlertSound },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Sound Volume</p>
                  <p className="text-xs text-muted-foreground">Set notification volume level</p>
                </div>
                <Select value={soundVolume} onValueChange={setSoundVolume}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>Manage system users and their roles</CardDescription>
              </div>
              <Button onClick={() => setAddUserOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add New User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-primary/15 text-primary border-0" : ""}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedUser(user); setEditUserOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedUser(user); setPasswordOpen(true); }}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          {user.role !== "Admin" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new system user with assigned role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="Enter email" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Enter password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={selectedUser.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancel</Button>
            <Button onClick={() => setEditUserOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Update password for ${selectedUser.name}` : "Update password"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input placeholder="Enter new password" type="password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input placeholder="Confirm new password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
            <Button onClick={() => setPasswordOpen(false)}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
