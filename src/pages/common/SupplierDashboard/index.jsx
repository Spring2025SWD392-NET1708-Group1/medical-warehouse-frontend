import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';



// Import icons
import { Package, ClipboardList, CheckCircle, XCircle, BarChart4, HelpCircle, Plus } from 'lucide-react';

const API_URL = "http://localhost:5090/api/stock-in-request";
const ITEM_API_URL = "http://localhost:5090/api/items"

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [items, setItems] = useState([]);
  const [isCreateRequestDialogOpen, setIsCreateRequestDialogOpen] = useState(false);
  const [isViewRequestDetailOpen, setIsViewRequestDetailOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [stockInRequest, setStockInRequest] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]); // For filtered requests

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRejectModal = (reason) => {
    setSelectedRejectReason(reason);
    setIsRejectModalOpen(true);
  };

  const [createRequest, setCreateRequest] = useState({
    itemId: null,
    quantity: null,
    importPricePerUnit: null,
    expiryDate: null,
    note: null,
  });

  // Mock data for the dashboard
  const pendingRequests = [
    { id: 'REQ-001', date: '2023-07-15', items: 5, status: 'PENDING', totalValue: 4500 },
    { id: 'REQ-002', date: '2023-07-18', items: 3, status: 'UNDER_REVIEW', totalValue: 2800 },
  ];

  const approvedRequests = [
    { id: 'REQ-003', date: '2023-07-01', items: 8, status: 'APPROVED', totalValue: 7200, paymentStatus: 'PAID' },
    { id: 'REQ-004', date: '2023-06-25', items: 4, status: 'COMPLETED', totalValue: 3500, paymentStatus: 'PAID' },
  ];

  const rejectedRequests = [
    { id: 'REQ-005', date: '2023-07-10', items: 2, status: 'REJECTED', totalValue: 1500, reason: 'Price too high' },
  ];

  // Mock data for the items dropdown
  const availableItems = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics' },
    { id: 3, name: 'Omeprazole 20mg', category: 'Gastrointestinal' },
  ];


  useEffect(() => {
    if (activeView === "create-request") {
      fetchItems(); // Assuming you already have this function defined
    }
    
    if (activeView === "overview") {
      fetchUserStockInRequests();
    }
  
    if (activeView === "pending-requests") {
      // Filter the requests to only include 'Pending' status (status 0)
      const pendingRequests = stockInRequest.filter(request => request.status === 0);
      setFilteredRequests(pendingRequests);
    }

    if (activeView === "approved-requests") {
      // Filter the requests to only include 'Pending' status (status 0)
      const approvedRequests = stockInRequest.filter(request => request.status === 2);
      setFilteredRequests(approvedRequests);
    }

    if (activeView === "rejected-requests") {
      // Filter the requests to only include 'Pending' status (status 0)
      const rejectedRequests = stockInRequest.filter(request => request.status === 4);
      setFilteredRequests(rejectedRequests);
    }
  
  }, [activeView, stockInRequest]);


  const fetchItems = async () => {
    try {
      const response = await fetch(`${ITEM_API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch stock-in requests:", error);
    }
  };

  // Handler functions
  const handleCreateRequest = async () => {
    try {
      // Log the body data being sent to the API
      console.log("Request Body: ", {
        itemId: createRequest.itemId,
        quantity: createRequest.quantity,
        importPricePerUnit: createRequest.importPricePerUnit,
        expiryDate: createRequest.expiryDate,
        note: createRequest.note ?? null,
      }); // Log the request body
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: createRequest.itemId,
          quantity: createRequest.quantity,
          importPricePerUnit: createRequest.importPricePerUnit,
          expiryDate: createRequest.expiryDate,
          note: createRequest.note ?? null,
        })
      });
      console.log("Response body: "+ response.body);
      if (!response.ok) {
        toast.error("Failed to create Stock in Request");
      }

    } catch (error) {
      console.error("Failed to create stock-in requests:", error);
    }
    setIsCreateRequestDialogOpen(false);
    // Show success message or notification
  };

  useEffect(() => {
    fetchUserStockInRequests();
  }, []);

  const fetchUserStockInRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStockInRequest(data);
    } catch (error) {
      console.error("Failed to fetch stock-in requests:", error);
    }
  };

  const handleUpdateStockInRequest = async (selectedRequest, updatedStatus) => {
    try {
      // Send the PUT request to update the stock-in request
      console.log("Update confirmed");
      const response = await fetch(`${API_URL}/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updatedStatus // Use the updated status passed to the function
        })

      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse the response body
      const data = await response.json();

      // Assuming the response contains the updated request data with the status
      // Update the selected request status with the new one from the response
      setSelectedRequest(prevRequest => ({
        ...prevRequest,
        status: data.status, // Assuming the response contains the updated status
      }));

      console.log("Stock-in request updated successfully with status:", data.status);

    } catch (error) {
      console.error("Failed to update stock-in request:", error);
    }
  };


  const handleViewRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsViewRequestDetailOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'Under Review',
      2: 'Approved',
      3: 'Completed',
      4: 'Rejected',
      5: 'Cancelled',
    };

    const statusStyles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800',
    };

    const statusText = statusMap[status] || 'Unknown';

    return (
      <Badge variant="outline" className={statusStyles[statusText] || 'bg-gray-100 text-gray-800'}>
        {statusText.replace('_', ' ')}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentStatusStyles = {
      0: "bg-yellow-100 text-yellow-800", // Pending
      1: "bg-green-100 text-green-800",  // Paid
      2: "bg-red-100 text-red-800",      // Cancelled
    };

    const paymentStatusText = {
      0: "Pending",
      1: "Paid",
      2: "Cancelled",
    };

    return (
      <Badge variant="outline" className={paymentStatusStyles[paymentStatus] || "bg-gray-100 text-gray-800"}>
        {paymentStatusText[paymentStatus] || "Unknown"}
      </Badge>
    );
  };



  // Sidebar navigation options
  const sidebarOptions = [
    { id: 'overview', label: 'Overview', icon: <BarChart4 className="h-5 w-5" /> },
    { id: 'create-request', label: 'Create Request', icon: <Plus className="h-5 w-5" /> },
    { id: 'pending-requests', label: 'Pending Requests', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'approved-requests', label: 'Approved Requests', icon: <CheckCircle className="h-5 w-5" /> },
    { id: 'rejected-requests', label: 'Rejected Requests', icon: <XCircle className="h-5 w-5" /> },
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
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review by staff</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvedRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Ready for delivery & payment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${approvedRequests.reduce((sum, req) => sum + req.totalValue, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">From approved requests</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-bold mb-4">Recent Requests</h3>
            <Table>
              <TableCaption>Your most recent stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockInRequest.slice(0, 3).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>${(request.quantity * request.importPricePerUnit || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequestDetails(request)}
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

      case 'create-request':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Stock-in Request</h2>
            <Card>
              <CardHeader>
                <CardTitle>New Stock-in Request</CardTitle>
                <CardDescription>
                  Submit a request to supply medical items to the warehouse. Staff will review your request for quantity and quality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item">Medical Item</Label>
                    <Select onValueChange={(value) => setCreateRequest(prevState => ({
                      ...prevState,
                      itemId: value // Set the itemId here from selected value
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Search Input */}
                        <div className="p-2">
                          <Input
                            placeholder="Search items..."
                            required
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        {/* Filtered Items */}
                        {filteredItems.length > 0 ? (
                          filteredItems.map(item => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} ({item.categoryName})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500 text-sm">No items found</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Quantity */}
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      required
                      value={createRequest.quantity}
                      onChange={(e) =>
                        setCreateRequest((prev) => ({
                          ...prev,
                          quantity: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  {/* Import Price per Unit */}
                  <div className="grid gap-2">
                    <Label htmlFor="importPrice">Import Price (per unit)</Label>
                    <Input
                      id="importPrice"
                      type="number"
                      required
                      value={createRequest.importPricePerUnit}
                      onChange={(e) =>
                        setCreateRequest((prev) => ({
                          ...prev,
                          importPricePerUnit: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="date"
                      required
                      value={createRequest.expiryDate}
                      onChange={(e) =>
                        setCreateRequest((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input
                      id="notes"
                      value={createRequest.note}
                      onChange={(e) =>
                        setCreateRequest((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleCreateRequest}>Submit Request</Button>
              </CardFooter>
            </Card>
          </>
        );

      case 'pending-requests':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
            <Table>
              <TableCaption>A list of your pending stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{request.itemName}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>  ${request.quantity * request.importPricePerUnit}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequestDetails(request)}
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

      case 'approved-requests':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Approved Requests</h2>
            <Table>
              <TableCaption>A list of your approved stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{request.itemName}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>${request.quantity * request.importPricePerUnit}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(request.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequestDetails(request)}
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

      case 'rejected-requests':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Rejected Requests</h2>
            <Table>
              <TableCaption>A list of your rejected stock-in requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{request.itemName}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>${request.quantity * request.importPricePerUnit}</TableCell>
                    <TableCell className="max-w-[200px]">
                      {request.rejectReason ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRejectModal(request.rejectReason)}
                        >
                          View Reason
                        </Button>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequestDetails(request)}
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

      case 'process-flow':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Request Process Flow</h2>
            <Card>
              <CardHeader>
                <CardTitle>Understanding the Process</CardTitle>
                <CardDescription>
                  How your stock-in requests are processed from creation to inventory update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-700 font-bold">1</span>
                    </div>
                    <h3 className="font-bold mb-1">Create Request</h3>
                    <p className="text-sm text-gray-600">Submit stock-in request with item details, quantity, and price</p>
                  </div>

                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>

                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                      <span className="text-yellow-700 font-bold">2</span>
                    </div>
                    <h3 className="font-bold mb-1">Staff Review</h3>
                    <p className="text-sm text-gray-600">Staff verifies quality and quantity of requested items</p>
                  </div>

                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>

                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-700 font-bold">3</span>
                    </div>
                    <h3 className="font-bold mb-1">Manager Approval</h3>
                    <p className="text-sm text-gray-600">Manager reviews and approves the stock-in request</p>
                  </div>

                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>

                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <span className="text-purple-700 font-bold">4</span>
                    </div>
                    <h3 className="font-bold mb-1">Payment</h3>
                    <p className="text-sm text-gray-600">Payment processed based on import price</p>
                  </div>

                  <div className="hidden md:block self-center">→</div>
                  <div className="block md:hidden self-center">↓</div>

                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                      <span className="text-indigo-700 font-bold">5</span>
                    </div>
                    <h3 className="font-bold mb-1">Inventory Update</h3>
                    <p className="text-sm text-gray-600">Staff receives items and updates warehouse inventory</p>
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
                  <h3 className="font-bold text-lg mb-2">1. Supplier Creates Stock-in Request</h3>
                  <p>As a supplier, you create a stock-in request specifying the medical items, quantities, import prices, and other relevant details.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Staff Verification</h3>
                  <p>Warehouse staff reviews your request to verify that the quantity and quality of the items meet the warehouse standards.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Manager Approval</h3>
                  <p>After staff verification, the warehouse manager reviews and approves the request based on inventory needs and budget considerations.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Payment Processing</h3>
                  <p>Once approved, payment is processed based on the agreed import price. You will receive notification when payment is complete.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-2">5. Inventory Update</h3>
                  <p>After payment, warehouse staff receives the items, inspects them, and updates the inventory system accordingly.</p>
                </div>
              </CardContent>
            </Card>
          </>
        );

      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  // Handle click on create request option directly
  const handleSidebarOptionClick = (optionId) => {
    if (optionId === 'create-request') {
      setActiveView('create-request');
    } else {
      setActiveView(optionId);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block md:w-64 border-r border-gray-200 bg-background">
        <div className="sticky top-0 h-screen pt-4 pb-16 overflow-y-auto flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Supplier Portal</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeView === option.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 text-left h-10"
                onClick={() => handleSidebarOptionClick(option.id)}
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

      {/* Stock in Request Details Dialog */}
      <Dialog open={isViewRequestDetailOpen} onOpenChange={setIsViewRequestDetailOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Stock In Request Details</DialogTitle>
            <DialogDescription>
              Review stock in request details
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Request ID</Label>
                    <div className="font-medium">{selectedRequest.id}</div>
                  </div>
                  <div>
                    <Label>Item</Label>
                    <div className="font-medium">{selectedRequest.itemName}</div>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <div className="font-medium">{selectedRequest.quantity}</div>
                  </div>
                  <div>
                    <Label>Import Price per Unit</Label>
                    <div className="font-medium">${selectedRequest.importPricePerUnit.toFixed(2)}</div>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <div className="font-medium">
                      {new Date(selectedRequest.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label>Request Status</Label>
                    <div className="font-medium">
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  <div>
                    <Label>Payment Status</Label>
                    <div className="font-medium">
                      {getPaymentStatusBadge(selectedRequest.paymentStatus)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Note</Label>
                  <div >
                    {/* Use a Textarea for larger input display */}
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows="4"  // Sets the number of visible rows (lines)
                      value={selectedRequest.note}
                      readOnly  // You can remove this if you want the user to edit the note
                    />
                  </div>
                </div>
              </div>

              {/* Confirmation Dialog */}
              {isCancelConfirmOpen && (
                <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Cancellation</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel this request? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCancelConfirmOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdateStockInRequest(selectedRequest, 5)} color="red">
                        Confirm Cancellation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}

          <DialogFooter>
            {/* Cancel Request Button */}
            {selectedRequest && selectedRequest.status === 0 && (
              <Button
                variant="destructive"
                color="red"
                onClick={() => setIsCancelConfirmOpen(true)}
              >
                Cancel Request
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsViewRequestDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Reason</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-gray-700">{selectedRejectReason}</div>
          <DialogFooter>
            <Button onClick={() => setIsRejectModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Mobile header and main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-10 border-b bg-background">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">Supplier Portal</h2>
            <Dialog open={isCreateRequestDialogOpen} onOpenChange={setIsCreateRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Stock-in Request</DialogTitle>
                  <DialogDescription>
                    Create a request to supply medical items to the warehouse.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item">Medical Item</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map(item => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name} ({item.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" min="1" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="importPrice">Import Price (per unit)</Label>
                    <Input id="importPrice" type="number" min="0.01" step="0.01" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input id="notes" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateRequestDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateRequest}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
          <div className="overflow-x-auto border-t">
            <div className="flex py-2 px-4">
              {sidebarOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={activeView === option.id ? "secondary" : "ghost"}
                  size="sm"
                  className="mr-2 flex-none whitespace-nowrap"
                  onClick={() => handleSidebarOptionClick(option.id)}
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
    </div>
  );
};

export default SupplierDashboard;
