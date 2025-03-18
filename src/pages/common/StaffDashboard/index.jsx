import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Import icons
import { Package, ClipboardList, CheckCircle, XCircle, BarChart4, HelpCircle, Search } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:5090/api/item-lots/storage/requests";
const INVENTORY_API_URL = "http://localhost:5090/api/inventory";

const StaffDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [assignedLots, setAssignedLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const staffId = jwtDecode(token).staffId;
  const storageName = jwtDecode(token).storageName;

  // Dialog states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAssignedLots();
  }, []);

  const fetchAssignedLots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAssignedLots(data);
    } catch (error) {
      console.error("Failed to fetch assigned lots:", error);
      setErrorMessage("Unable to load assigned lots. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    setIsDetailsDialogOpen(true);
  };

  const handleConfirmStorage = async () => {
    setIsLoading(true);
    try {
      // Update inventory
      await updateInventory(selectedLot.itemLotId);
      // Update lot status to completed
      await updateLotStatus(selectedLot.itemLotId, 6); // 6 = Completed
      setIsDetailsDialogOpen(false);
      setSelectedLot(null);
      fetchAssignedLots();
      toast.success("Storage confirmed successfully");
    } catch (error) {
      console.error("Failed to confirm storage:", error);
      setErrorMessage("Failed to confirm storage. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventory = async (lotId) => {
    try {
      const response = await fetch(`${INVENTORY_API_URL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lotId: lotId
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating inventory:", error);
      throw error;
    }
  };

  const updateLotStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating lot status:", error);
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 5:
        return <Badge className="bg-indigo-100 text-indigo-800">Assigned</Badge>;
      case 6:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Sidebar navigation options
  const sidebarOptions = [
    { id: 'overview', label: 'Overview', icon: <BarChart4 className="h-5 w-5" /> },
    { id: 'assigned', label: 'Assigned Lots', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="h-5 w-5" /> },
    { id: 'process-flow', label: 'Process Flow', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  // Filter assigned lots based on search term
  const filteredLots = assignedLots.filter(
    (lot) =>
      lot.itemLotId.toString().includes(searchTerm) ||
      (lot.item?.name && lot.item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Lots</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {assignedLots.filter(lot => lot.status === 5).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending storage</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Lots</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {assignedLots.filter(lot => lot.status === 6).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Successfully stored</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Location</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {storageName}
                  </div>
                  <p className="text-xs text-muted-foreground">Your assigned area</p>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Recent Assignments</h3>
            <Table>
              <TableCaption>Your most recent assigned lots</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedLots.slice(0, 5).map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{lot.item?.name || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRowClick(lot)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case 'assigned':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Assigned Lots</h2>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by ID or item name..."
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableCaption>A list of all assigned lots</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLots.map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{lot.item?.name || "N/A"}</TableCell>
                    <TableCell>{lot.quantity || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRowClick(lot)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case 'inventory':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>
                  View and manage inventory in your assigned storage location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold mb-4">Inventory Management</h3>
                  <p>Inventory management functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'process-flow':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Storage Process Flow</h2>
            <Card>
              <CardHeader>
                <CardTitle>Understanding the Process</CardTitle>
                <CardDescription>
                  How to handle assigned lots and update inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-700 font-bold">1</span>
                    </div>
                    <h3 className="font-bold mb-1">Receive Assignment</h3>
                    <p className="text-sm text-gray-600">Get assigned to store items</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                      <span className="text-yellow-700 font-bold">2</span>
                    </div>
                    <h3 className="font-bold mb-1">Verify Items</h3>
                    <p className="text-sm text-gray-600">Check quantity and quality</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-700 font-bold">3</span>
                    </div>
                    <h3 className="font-bold mb-1">Store Items</h3>
                    <p className="text-sm text-gray-600">Place items in assigned location</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <span className="text-purple-700 font-bold">4</span>
                    </div>
                    <h3 className="font-bold mb-1">Update Inventory</h3>
                    <p className="text-sm text-gray-600">Confirm storage completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detailed Process Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Receive Assignment</h3>
                  <p>You will be assigned to handle the storage of specific items in your designated storage location.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Verify Items</h3>
                  <p>Before storing, verify the quantity and quality of the items match the request details.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Store Items</h3>
                  <p>Place the items in the assigned storage location following proper organization guidelines.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Update Inventory</h3>
                  <p>Confirm the storage completion to update the inventory system.</p>
                </div>
              </CardContent>
            </Card>
          </>
        );

      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 border-r border-gray-200 bg-background">
        <div className="sticky top-0 h-screen pt-4 pb-16 overflow-y-auto flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Staff Portal</h2>
            <p className="text-sm text-muted-foreground mt-1">{storageName}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeView === option.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 text-left h-10"
                onClick={() => setActiveView(option.id)}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Medical Warehouse System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header and main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-10 border-b bg-background">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-xl font-bold">Staff Portal</h2>
              <p className="text-sm text-muted-foreground">{storageName}</p>
            </div>
          </div>
          <div className="overflow-x-auto border-t">
            <div className="flex py-2 px-4">
              {sidebarOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={activeView === option.id ? "secondary" : "ghost"}
                  size="sm"
                  className="mr-2 flex-none whitespace-nowrap"
                  onClick={() => setActiveView(option.id)}
                >
                  <span className="flex items-center">
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto p-6 max-w-6xl">
          {renderContent()}
        </div>
      </div>

      {/* Lot Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lot Details</DialogTitle>
            <DialogDescription>
              Review lot details and confirm storage
            </DialogDescription>
          </DialogHeader>
          {selectedLot && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Request ID</Label>
                    <div className="font-medium">{selectedLot.itemLotId}</div>
                  </div>
                  <div>
                    <Label>Item</Label>
                    <div className="font-medium">{selectedLot.item?.name}</div>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <div className="font-medium">{selectedLot.quantity}</div>
                  </div>
                  <div>
                    <Label>Quality</Label>
                    <div className="font-medium">{selectedLot.quality}</div>
                  </div>
                  <div>
                    <Label>Storage Location</Label>
                    <div className="font-medium">{selectedLot.storageName}</div>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <div className="font-medium">
                      {new Date(selectedLot.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmStorage}
                  disabled={selectedLot.status === 6}
                >
                  Confirm Storage
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffDashboard;
