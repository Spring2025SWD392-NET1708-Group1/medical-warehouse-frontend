import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Search,
  Package,
  ShoppingCart,
  Users,
  FileText,
  CircleHelp,
  Settings,
  Truck,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CustomerPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for orders
  const recentOrders = [
    { id: 'ORD-001', date: '2025-03-10', items: 5, status: 'Completed', total: '$1,245.00' },
    { id: 'ORD-002', date: '2025-03-09', items: 2, status: 'Processing', total: '$345.50' },
    { id: 'ORD-003', date: '2025-03-07', items: 8, status: 'Shipped', total: '$2,150.75' },
    { id: 'ORD-004', date: '2025-03-05', items: 1, status: 'Pending', total: '$75.20' }
  ];

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5090/api/items');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load medical items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-800">Medical Warehouse</h1>
          <p className="text-sm text-gray-500">Inventory Management System</p>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search items..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Truck className="mr-2 h-4 w-4" />
            Inventory
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Suppliers
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button className="w-full justify-start" size="sm">
                <Package className="mr-2 h-4 w-4" />
                New Order
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Truck className="mr-2 h-4 w-4" />
                Receive Items
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-auto space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CircleHelp className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
              <p className="text-gray-500">Manage your medical supplies efficiently</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
              <Button size="sm">My Account</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="md:col-span-3">
              <CardHeader className="bg-blue-50">
                <CardTitle>Welcome to Medical Warehouse Management System</CardTitle>
                <CardDescription>
                  Browse, order and manage medical supplies for your facility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Our system provides a comprehensive solution for healthcare providers to efficiently manage
                  their medical inventory. Browse our extensive catalog of medical supplies, place orders,
                  and track shipments all in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <Package className="mr-2 h-4 w-4" />
                    Browse Catalog
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Order History
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Available Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                  <p className="text-xs text-gray-500">
                    {loading ? 'Loading...' : `Across ${[...new Set(items.map(item => item.categoryName))].length} categories`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-gray-500">Last updated: Today at 9:45 AM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend (YTD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,892.30</div>
                  <p className="text-xs text-gray-500">15% increase from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-gray-500">Quick access to frequent purchases</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <div className="md:col-span-3">
              <Tabs defaultValue="items">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="items">Medical Items</TabsTrigger>
                  <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Medical Items</CardTitle>
                      <CardDescription>Browse our catalog of medical supplies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          <span className="ml-2">Loading items...</span>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8 text-red-500">
                          <p>{error}</p>
                          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Supplier</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredItems.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6">
                                  {searchTerm ? 'No items match your search criteria' : 'No items available'}
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.categoryName}</TableCell>
                                  <TableCell>{item.supplierName}</TableCell>
                                  <TableCell>{item.itemType}</TableCell>
                                  <TableCell className="text-right">${item.exportPricePerUnit.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Button size="sm" variant="outline">Add to Cart</Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                    {!loading && !error && filteredItems.length > 0 && (
                      <CardFooter className="flex justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Showing {filteredItems.length} of {items.length} items</span>
                        </div>
                        <Button variant="outline" size="sm">View All Items</Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>View and manage your recent orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>{order.items}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === 'Completed' ? 'default' :
                                      order.status === 'Processing' ? 'secondary' :
                                        order.status === 'Shipped' ? 'outline' : 'destructive'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{order.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">View All Orders</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
