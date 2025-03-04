import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { InboxIcon, Search, FileText, AlertCircle, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5090/api/lot-request";
const ITEMS_API_URL = "http://localhost:5090/api/items";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [lotRequests, setLotRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLot, setSelectedLot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storageLocation, setStorageLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const token = localStorage.getItem("token")

  // Items state
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState("");

  useEffect(() => {
    fetchLotRequests();

    // Set up screen size listener
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    // Check initial screen size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "search") {
      fetchItems();
    }
  }, [activeTab]);

  useEffect(() => {
    // Filter requests based on search term
    if (searchTerm.trim() === "") {
      setFilteredRequests(lotRequests);
    } else {
      const filtered = lotRequests.filter(
        (lot) =>
          lot.lotRequestId.toString().includes(searchTerm) ||
          (lot.item?.name && lot.item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, lotRequests]);

  useEffect(() => {
    // Filter items based on item search term
    if (itemSearchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(itemSearchTerm.toLowerCase())) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(itemSearchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [itemSearchTerm, items]);

  const fetchLotRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLotRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Failed to fetch lot requests:", error);
      setErrorMessage("Unable to load lot requests. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoadingItems(true);
      setItemsError("");
      const response = await fetch(ITEMS_API_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setItemsError("Unable to load items. Please try again later.");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    setIsDialogOpen(true);
    setStorageLocation("");
    setErrorMessage("");
  };

  const handleApprove = async () => {
    if (storageLocation.trim()) {
      setIsLoading(true);
      try {
        await updateLotStatus(selectedLot.lotRequestId, parseInt(storageLocation), 3);
        setIsDialogOpen(false);
        setSelectedLot(null);
        fetchLotRequests(); // Refresh the list after approval
      } catch (error) {
        console.error("Failed to approve lot request:", error);
        setErrorMessage("Failed to approve lot request. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please enter a storage location");
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.lotRequestId, parseInt(storageLocation), 5);
      setIsDialogOpen(false);
      setSelectedLot(null);
      fetchLotRequests(); // Refresh the list after rejection
    } catch (error) {
      console.error("Failed to reject lot request:", error);
      setErrorMessage("Failed to reject lot request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLotStatus = async (id, storageId, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storageId: storageId,
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
    // Convert status to number if it's not already
    const statusNum = typeof status === 'string' ? parseInt(status) : status;

    switch (statusNum) {
      case 1:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">New</Badge>;
      case 2:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case 3:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Approved</Badge>;
      case 4:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">In Process</Badge>;
      case 5:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <div className={`bg-white border-r shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && <h2 className="text-xl font-bold text-gray-800">Inventory</h2>}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                {sidebarCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                )}
              </button>
            </div>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${activeTab === "requests"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab("requests")}
              >
                <InboxIcon size={20} />
                {!sidebarCollapsed && <span>Lot Requests</span>}
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${activeTab === "search"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab("search")}
              >
                <Search size={20} />
                {!sidebarCollapsed && <span>Search</span>}
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${activeTab === "report"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab("report")}
              >
                <FileText size={20} />
                {!sidebarCollapsed && <span>Reports</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b shadow-sm px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === "requests" && "Lot Request Management"}
                {activeTab === "search" && "Search Items"}
                {activeTab === "report" && "Reports"}
              </h1>
              <div className="flex space-x-2">
                <Button
                  onClick={activeTab === "search" ? fetchItems : fetchLotRequests}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Clock size={16} />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "requests" && (
              <>
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

                <Card className="overflow-hidden border-none shadow-md h-full flex-1">
                  <CardHeader className="bg-gray-50 border-b pb-3">
                    <CardTitle className="text-lg font-medium">Lot Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading && lotRequests.length === 0 ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : errorMessage && lotRequests.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <AlertCircle size={40} className="mb-2 text-amber-500" />
                        <p>{errorMessage}</p>
                        <Button variant="outline" className="mt-4" onClick={fetchLotRequests}>
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                              <TableHead className="font-medium">ID</TableHead>
                              <TableHead className="font-medium">Item</TableHead>
                              <TableHead className="font-medium">Quantity</TableHead>
                              <TableHead className="font-medium">Quality</TableHead>
                              <TableHead className="font-medium">Status</TableHead>
                              <TableHead className="font-medium">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRequests.map((lot) => (
                              <TableRow
                                key={lot.lotRequestId}
                                className="cursor-pointer hover:bg-blue-50 transition-colors"
                              >
                                <TableCell className="font-medium">{lot.lotRequestId}</TableCell>
                                <TableCell>{lot.item?.name || "N/A"}</TableCell>
                                <TableCell>{lot.item?.quantity || "N/A"}</TableCell>
                                <TableCell>{lot.quality || "N/A"}</TableCell>
                                <TableCell>
                                  {getStatusBadge(lot.status)}
                                </TableCell>
                                <TableCell>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all"
                                      onClick={() => handleRowClick(lot)}
                                    >
                                      View Details
                                    </Button>
                                  </motion.button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {filteredRequests.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                  {searchTerm ? (
                                    <>
                                      <Search size={40} className="mx-auto mb-2 opacity-40" />
                                      <p>No matching requests found</p>
                                    </>
                                  ) : (
                                    <>
                                      <InboxIcon size={40} className="mx-auto mb-2 opacity-40" />
                                      <p>No pending requests available</p>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "search" && (
              <>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search items by name, description or category..."
                      className="pl-10 bg-white"
                      value={itemSearchTerm}
                      onChange={(e) => setItemSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {isLoadingItems ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : itemsError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <AlertCircle size={40} className="mb-2 text-amber-500" />
                    <p>{itemsError}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchItems}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        className="transition-all duration-200"
                      >
                        <Card className="overflow-hidden h-full shadow-sm border border-gray-200 hover:shadow-md">
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <img
                              src="https://s3.eu-north-1.amazonaws.com/cdn-site.mediaplanet.com/app/uploads/sites/94/2024/06/07205740/AdobeStock_627493260-576x486.jpg"
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-3 right-3 bg-blue-500">
                              {item.categoryName}
                            </Badge>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <Label className="text-gray-500">Quantity</Label>
                                <div className="font-medium">{item.quantity}</div>
                              </div>
                              <div>
                                <Label className="text-gray-500">Price</Label>
                                <div className="font-medium">${item.price.toFixed(2)}</div>
                              </div>
                              <div>
                                <Label className="text-gray-500">Storage</Label>
                                <div className="font-medium">{item.storageName || "N/A"}</div>
                              </div>
                              <div>
                                <Label className="text-gray-500">Expires</Label>
                                <div className="font-medium">{formatDate(item.expiryDate)}</div>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full mt-2 flex items-center justify-center gap-2"
                            >
                              <Package size={16} />
                              <span>View Details</span>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {filteredItems.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <Search size={40} className="mb-2 opacity-40" />
                        <p className="text-lg font-medium">No items found</p>
                        <p className="text-gray-400">Try adjusting your search criteria</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "report" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <h2 className="text-xl font-semibold mb-2">Reports Module</h2>
                  <p className="text-gray-500">Reporting functionality will be implemented here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setErrorMessage("");
        }}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-lg">
            <DialogHeader className="bg-gray-50 p-6 border-b">
              <DialogTitle className="text-xl font-semibold">Lot Request Details</DialogTitle>
            </DialogHeader>
            {selectedLot && (
              <>
                <div className="p-6 grid gap-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <Label className="text-gray-500 text-sm">Lot ID</Label>
                      <div className="mt-1 font-semibold text-gray-800">{selectedLot.lotRequestId}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedLot.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Item</Label>
                      <div className="mt-1 font-medium">{selectedLot.item?.name || "N/A"}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Quantity</Label>
                      <div className="mt-1 font-medium">{selectedLot.item?.quantity || "N/A"}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">Quality</Label>
                      <div className="mt-1 font-medium">{selectedLot.quality || "N/A"}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Label htmlFor="storage" className="text-gray-500 text-sm">
                      Storage Location
                    </Label>
                    <Input
                      id="storage"
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      className="mt-1"
                      placeholder="Enter storage location ID"
                      type="number"
                    />
                    {errorMessage && (
                      <p className="mt-2 text-red-600 text-sm flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-1 border-2 border-b-transparent rounded-full"></div>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <XCircle size={16} />
                        <span>Reject</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    disabled={!storageLocation.trim() || isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-1 border-2 border-b-transparent rounded-full"></div>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Approve</span>
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
