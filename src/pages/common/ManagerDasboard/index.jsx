import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Import icons
import { Package, ClipboardList, CheckCircle, XCircle, BarChart4, HelpCircle, DollarSign, UserPlus } from 'lucide-react';

const API_URL = "http://localhost:5090/api/item-lots/create-requests";
const STORAGES_API_URL = "http://localhost:5090/api/storage";
const STAFF_API_URL = "http://localhost:5090/api/staff";

const ManagerDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [itemLots, setItemLots] = useState([]);
  const [storages, setStorages] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  // Dialog states
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    fetchItemLots();
    fetchStorages();
    fetchStaffMembers();
  }, []);

  const fetchItemLots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setItemLots(data);
    } catch (error) {
      console.error("Failed to fetch item lots:", error);
      setErrorMessage("Unable to load item lots. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStorages = async () => {
    try {
      const response = await fetch(STORAGES_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStorages(data);
    } catch (error) {
      console.error("Failed to fetch storages:", error);
      toast.error("Unable to load storage locations");
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch(STAFF_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
      console.error("Failed to fetch staff members:", error);
      toast.error("Unable to load staff members");
    }
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    if (lot.status === 2) { // Approved
      setIsAssignmentDialogOpen(true);
    } else if (lot.status === 1) { // Pending
      setIsReviewDialogOpen(true);
    } else if (lot.status === 3) { // Paid
      setIsPaymentDialogOpen(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedStorage.trim()) {
      setErrorMessage("Please select a storage location");
      return;
    }

    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.itemLotId, parseInt(selectedStorage), 2);
      setIsReviewDialogOpen(false);
      setSelectedLot(null);
      fetchItemLots();
      toast.success("Request approved successfully");
    } catch (error) {
      console.error("Failed to approve item lot:", error);
      setErrorMessage("Failed to approve item lot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.itemLotId, null, 4);
      setIsReviewDialogOpen(false);
      setSelectedLot(null);
      fetchItemLots();
      toast.success("Request rejected successfully");
    } catch (error) {
      console.error("Failed to reject item lot:", error);
      setErrorMessage("Failed to reject item lot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.itemLotId, null, 3);
      setIsPaymentDialogOpen(false);
      setSelectedLot(null);
      fetchItemLots();
      toast.success("Payment processed successfully");
    } catch (error) {
      console.error("Failed to process payment:", error);
      setErrorMessage("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffAssignment = async () => {
    if (!selectedStaff.trim()) {
      setErrorMessage("Please select a staff member");
      return;
    }

    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.itemLotId, parseInt(selectedStorage), 5, selectedStaff);
      setIsAssignmentDialogOpen(false);
      setSelectedLot(null);
      fetchItemLots();
      toast.success("Staff assigned successfully");
    } catch (error) {
      console.error("Failed to assign staff:", error);
      setErrorMessage("Failed to assign staff. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLotStatus = async (id, storageId, status, staffId = null) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          storageId: storageId,
          status: status,
          staffId: staffId
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
      case 0:
        return <Badge className="bg-blue-100 text-blue-800">In Checking</Badge>;
      case 1:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 2:
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 3:
        return <Badge className="bg-purple-100 text-purple-800">Paid</Badge>;
      case 4:
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 5:
        return <Badge className="bg-indigo-100 text-indigo-800">Assigned</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Sidebar navigation options
  const sidebarOptions = [
    { id: 'overview', label: 'Overview', icon: <BarChart4 className="h-5 w-5" /> },
    { id: 'stock-in', label: 'Stock-in Requests', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'assignments', label: 'Staff Assignments', icon: <UserPlus className="h-5 w-5" /> },
    { id: 'process-flow', label: 'Process Flow', icon: <HelpCircle className="h-5 w-5" /> },
  ];

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
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {itemLots.filter(lot => lot.status === 1).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {itemLots.filter(lot => lot.status === 2).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready for payment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Requests</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {itemLots.filter(lot => lot.status === 3).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready for assignment</p>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Recent Requests</h3>
            <Table>
              <TableCaption>Your most recent stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemLots.slice(0, 5).map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>${(lot.quantity * lot.item?.importPricePerUnit).toFixed(2)}</TableCell>
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

      case 'stock-in':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Stock-in Requests</h2>
            <Table>
              <TableCaption>A list of all stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemLots.map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{lot.item?.name || "N/A"}</TableCell>
                    <TableCell>{lot.quantity || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>${(lot.quantity * lot.item?.importPricePerUnit).toFixed(2)}</TableCell>
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

      case 'payments':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Payment Processing</h2>
            <Table>
              <TableCaption>A list of approved requests pending payment</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemLots.filter(lot => lot.status === 2).map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{lot.item?.name || "N/A"}</TableCell>
                    <TableCell>{lot.quantity || "N/A"}</TableCell>
                    <TableCell>${(lot.quantity * lot.item?.importPricePerUnit).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRowClick(lot)}
                      >
                        Process Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case 'assignments':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Staff Assignments</h2>
            <Table>
              <TableCaption>A list of paid requests pending staff assignment</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemLots.filter(lot => lot.status === 3).map((lot) => (
                  <TableRow key={lot.itemLotId}>
                    <TableCell>{lot.itemLotId}</TableCell>
                    <TableCell>{new Date(lot.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{lot.item?.name || "N/A"}</TableCell>
                    <TableCell>{lot.storageName || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRowClick(lot)}
                      >
                        Assign Staff
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case 'process-flow':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Request Process Flow</h2>
            <Card>
              <CardHeader>
                <CardTitle>Understanding the Process</CardTitle>
                <CardDescription>
                  How stock-in requests are processed from staff verification to inventory update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-700 font-bold">1</span>
                    </div>
                    <h3 className="font-bold mb-1">Staff Verification</h3>
                    <p className="text-sm text-gray-600">Staff verifies quantity and quality</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                      <span className="text-yellow-700 font-bold">2</span>
                    </div>
                    <h3 className="font-bold mb-1">Manager Review</h3>
                    <p className="text-sm text-gray-600">Manager reviews and approves request</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-700 font-bold">3</span>
                    </div>
                    <h3 className="font-bold mb-1">Payment</h3>
                    <p className="text-sm text-gray-600">Process payment for approved request</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <span className="text-purple-700 font-bold">4</span>
                    </div>
                    <h3 className="font-bold mb-1">Staff Assignment</h3>
                    <p className="text-sm text-gray-600">Assign staff for storage</p>
                  </div>
                  
                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>
                  
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                      <span className="text-indigo-700 font-bold">5</span>
                    </div>
                    <h3 className="font-bold mb-1">Inventory Update</h3>
                    <p className="text-sm text-gray-600">Staff confirms storage</p>
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
                  <h3 className="font-bold text-lg mb-2">1. Staff Verification</h3>
                  <p>Warehouse staff verifies the quantity and quality of the items in the stock-in request.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Manager Review</h3>
                  <p>Manager reviews the verified request and approves or rejects it based on inventory needs and budget considerations.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Payment Processing</h3>
                  <p>After approval, payment is processed based on the agreed import price.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Staff Assignment</h3>
                  <p>Manager assigns warehouse staff to handle the storage of approved items.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">5. Inventory Update</h3>
                  <p>Assigned staff confirms storage and updates the inventory system.</p>
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
            <h2 className="text-xl font-bold">Manager Portal</h2>
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
            <h2 className="text-xl font-bold">Manager Portal</h2>
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

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Stock-in Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject the stock-in request
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
                    <Label>Amount</Label>
                    <div className="font-medium">
                      ${(selectedLot.quantity * selectedLot.item?.importPricePerUnit).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Storage Location</Label>
                  <Select value={selectedStorage} onValueChange={setSelectedStorage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage location" />
                    </SelectTrigger>
                    <SelectContent>
                      {storages.map((storage) => (
                        <SelectItem key={storage.id} value={storage.id.toString()}>
                          {storage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Process payment for the approved stock-in request
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
                    <Label>Amount</Label>
                    <div className="font-medium">
                      ${(selectedLot.quantity * selectedLot.item?.importPricePerUnit).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePayment}>
                  Confirm Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Staff Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Staff Member</DialogTitle>
            <DialogDescription>
              Assign a staff member to handle the storage of items
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
                    <Label>Storage</Label>
                    <div className="font-medium">{selectedLot.storageName}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Staff Member</Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id.toString()}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStaffAssignment}>
                  Assign Staff
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;
