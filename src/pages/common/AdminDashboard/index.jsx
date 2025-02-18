import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "Manager", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Staff", status: "Inactive" },
  ]);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Warehouse Overview */}
          <Card className="mb-6">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Warehouse Overview</h2>
              <p>Total Users: {users.length}</p>
              <p>Active Users: {users.filter(user => user.status === "Active").length}</p>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4">Add New User</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
