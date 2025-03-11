import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle, Search as SearchIcon, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { decodeToken } from "@/utils/decodeJWT";
import { jwtDecode } from "jwt-decode";


const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("lots");
  const [lotRequests, setLotRequests] = useState([]);
  const [storageLots, setStorageLots] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newLotData, setNewLotData] = useState({
    quality: "",
    itemId: "", // Default to first item
    storageId: "",
    quantity: "",
    expiryDate: "",
  });
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);



  const token = localStorage.getItem("token");
  const storageName = jwtDecode(token).storageName;
  const storageId = jwtDecode(token).storageId;



  useEffect(() => {
    if (activeTab === "search") {
      fetchItems();
    }
    if (activeTab === "lots") {
      fetchLotRequests();
    }
    if(activeTab === "storage"){
      fetchStorageLots();
    }
  }, [activeTab]);

  

  const fetchLotRequests = async () => {
    try {
      const response = await fetch("http://localhost:5090/api/item-lots/storage/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLotRequests(data);
    } catch (error) {
      console.error("Error fetching item lots:", error);
      return [];
    }
  };

  const fetchStorageLots = async () => {
    try {
      const response = await fetch(`http://localhost:5090/api/item-lots/storage/${storageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStorageLots(data);
    } catch (error) {
      console.error("Error fetching item lots:", error);
      return [];
    }
  };


  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5090/api/items", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not ok
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error fetching items");
      throw error;  // Rethrow the error so it can be caught in addNewLot
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the request body to the console
      console.log("Request body:", {
        quality: newLotData.quality,
        quantity: newLotData.quantity,
        itemId: selectedItem.id,
        storageId: storageId,
        expiryDate: newLotData.expiryDate,
      });
      const response = await fetch("http://localhost:5090/api/item-lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quality: newLotData.quality,
          quantity: newLotData.quantity,
          itemId: selectedItem.id,
          storageId: storageId,
          expiryDate: newLotData.expiryDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create new Item Lot");
      }

      // Add the new lot request to the local state
      await fetchLotRequests();


      // Show success toast
      toast.success("Lot request submitted successfully");
    } catch (error) {
      console.error("Error submitting lot request:", error);
      toast.error("Failed to submit lot request");
    }
    finally {
      // Reset form and close dialog
      setIsDialogOpen(false);
      setSelectedItem(null);
      setNewLotData({});
    }
  };

  const addNewLot = async () => {
    try {
      setIsDialogOpen(true);  // Open dialog only if the fetch is successful
    } catch (error) {
      console.error("Error when fetching", error);
      // Do not open the dialog in case of error
    }
  };

  useEffect(() => {
    console.log("Selected Item Data after set:", selectedItem);  // Log the state after setting

  }, [selectedItem]);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Staff Menu</h2>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "lots" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("lots")}
              >
                <PlusCircle size={20} />
                Lot Requests
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "search" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("search")}
              >
                <SearchIcon size={20} />
                Import Lot Data
              </button>

              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "storage" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("storage")}
              >
                <FileText size={20} />
                All Storage Lots
              </button>

              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "report" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("report")}
              >
                <FileText size={20} />
                Report
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Storage {storageName}</h2>
          {activeTab === "lots" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full col-span-2">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4 text-center">All Lot Requests</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lot ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Storage</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotRequests.map((lot) => (
                        <TableRow key={lot.itemLotId}>
                          <TableCell>{lot.itemLotId}</TableCell>
                          <TableCell>{lot.item.name}</TableCell>
                          <TableCell>{lot.quality}</TableCell>
                          <TableCell>{lot.quantity}</TableCell>
                          <TableCell>{lot.status}</TableCell>
                          <TableCell>{lot.storageName ?? "N/A"}</TableCell>
                          <TableCell>{new Date(lot.expiryDate).toLocaleDateString()}</TableCell>

                          {/* Button to handle actions based on the status */}
                          <TableCell>
                            {lot.status === "ToBeImport" && (
                              <Button onClick={() => handleImportConfirm(lot.itemLotId, "Confirm Check")} className="btn btn-primary">
                                Confirm Check
                              </Button>
                            )}
                            {lot.status === "NeedDisposing" && (
                              <Button onClick={() => handleDispose(lot.itemLotId, "Confirm Disposal")} className="btn btn-danger">
                                Confirm Disposal
                              </Button>
                            )}
                            {lot.status === "Rejected" && (
                              <Button onClick={() => handleRemove(lot.itemLotId, "Confirm Return")} className="btn btn-warning">
                                Confirm Remove
                              </Button>
                            )}
                            {lot.status === "Pending" && (
                              <Button
                                onClick={() => {
                                  setIsItemDetailOpen(true);       // Trigger the function to add a new lot
                                  setSelectedItem(lot.item);  // Set the selected lot (you can pass the selected lot data if needed)
                                }} className="btn btn-warning"
                              >
                                View Item Info
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full col-span-2">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4 text-center">All Storage {storageName} Lots</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lot ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Storage</TableHead>
                        <TableHead>Expiry Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storageLots.map((lot) => (
                        <TableRow key={lot.itemLotId}>
                          <TableCell>{lot.itemLotId}</TableCell>
                          <TableCell>{lot.item.name}</TableCell>
                          <TableCell>{lot.quality}</TableCell>
                          <TableCell>{lot.quantity}</TableCell>
                          <TableCell>{lot.status}</TableCell>
                          <TableCell>{lot.storageName ?? "N/A"}</TableCell>
                          <TableCell>{new Date(lot.expiryDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}


          {activeTab === "search" && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search items by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <SearchIcon size={20} />
                </Button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredItems.map((item) => (
                  <Card key={item.id} className="w-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src="https://s3.eu-north-1.amazonaws.com/cdn-site.mediaplanet.com/app/uploads/sites/94/2024/06/07205740/AdobeStock_627493260-576x486.jpg" alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Details Section */}
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                        <div className="space-y-2">
                          <p><strong>Category:</strong> {item.categoryName}</p>
                          <p><strong>Supplier:</strong> {item.supplierName}</p>
                          <p><strong>Import Price per Unit:</strong> {item.importPricePerUnit.toFixed(2)}$</p>
                          <p><strong>Export Price Per Unit:</strong> {item.exportPricePerUnit ? `${item.exportPricePerUnit.toFixed(2)}$` : "N/A"}</p>
                          <p><strong>Available For Sale:</strong> {item.isForSale ? "Yes" : "No"}</p>
                        </div>
                        <div className="mt-5">
                          <Button
                            onClick={() => {
                              console.log("Selected Item Data before set:", item);  // Check the structure before setting
                              setSelectedItem(item);  // Set the selected item
                              addNewLot();  // Trigger the function to add a new lot)
                            }}
                            className="mb-4">Create new Lot
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "report" && (
            <div className="text-center p-8">
              <h2 className="text-xl">Report Component</h2>
              <p>Report functionality coming soon...</p>
            </div>
          )}
        </div>

        {/* Lot Request Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Lot Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quality">Item</Label>
                <Input
                  id="itemId"
                  key={selectedItem ? selectedItem.id : ''}
                  value={selectedItem ? selectedItem.name : ''}
                  readOnly
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quality">Lot Quality</Label>
                <Input
                  id="quality"
                  value={newLotData.quality}
                  onChange={(e) =>
                    setNewLotData(prev => ({ ...prev, quality: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Lot Quantity {selectedItem && selectedItem.itemType ? `(${selectedItem.itemType})` : ''}</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newLotData.quantity}
                  onChange={(e) =>
                    setNewLotData(prev => ({ ...prev, quantity: e.target.value }))
                  }
                  required
                  min="1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newLotData.expiryDate}
                  onChange={(e) =>
                    setNewLotData(prev => ({ ...prev, expiryDate: e.target.value }))
                  }
                  required
                />
              </div>
              <Button type="submit">Submit Create Lot Request</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isItemDetailOpen} onOpenChange={(open) => {
          setIsItemDetailOpen(open);
          if (!open) {
            setSelectedItem({});
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Item details content */}
              <p><strong>Category:</strong> {selectedItem ? selectedItem.categoryName : 'Loading...'}</p>
              <p><strong>Description:</strong> {selectedItem ? selectedItem.description : 'Loading...'}</p>
              <p><strong>Supplier:</strong> {selectedItem ? selectedItem.supplierName : 'Loading...'}</p>
              <p><strong>Import Price per Unit:</strong> {selectedItem ? selectedItem.importPricePerUnit.toFixed(2) + '$' : 'Loading...'}</p>
              <p><strong>Export Price Per Unit:</strong> {selectedItem ? (selectedItem.exportPricePerUnit ? selectedItem.exportPricePerUnit.toFixed(2) + '$' : 'N/A') : 'Loading...'}</p>
              <p><strong>Available For Sale:</strong> {selectedItem ? (selectedItem.isForSale ? 'Yes' : 'No') : 'Loading...'}</p>
            </div>
            <Button onClick={() => setIsItemDetailOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
