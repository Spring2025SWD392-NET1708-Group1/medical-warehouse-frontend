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

// Predefined items with their IDs
const ITEM_TYPES = [
  {
    name: "Disposable gloves",
    id: "1bfe3b07-5419-4718-bed9-0439016c7f78"
  },
  {
    name: "Antibiotic Ointment",
    id: "3d2a1e6d-b173-4db6-a2b4-1cb8bdfb94c9"
  },
  {
    name: "Pain reliever",
    id: "80c0ac22-9f4d-478e-8fe1-f01b4e6727b0"
  }
];

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("lots");
  const [lotRequests, setLotRequests] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLotData, setNewLotData] = useState({
    quality: "",
    itemId: ITEM_TYPES[0].id, // Default to first item
    userId: "d8f0b849-d1a2-45d5-8a23-47772060c8f2",
    storageId: 1,
    quantity: "",
    stockinDate: "",
  });
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    if (activeTab === "search") {
      fetchItems();
    }
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5090/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5090/api/lot-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quality: newLotData.quality,
          itemId: newLotData.itemId,
          userId: newLotData.userId,
          storageId: newLotData.storageId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lot request");
      }

      const responseData = await response.json();

      // Add the new lot request to the local state
      setLotRequests(prevRequests => [...prevRequests, {
        ...responseData,
        item: ITEM_TYPES.find(item => item.id === newLotData.itemId)?.name,
      }]);

      // Reset form and close dialog
      setNewLotData({
        quality: "",
        itemId: ITEM_TYPES[0].id,
        userId: "d8f0b849-d1a2-45d5-8a23-47772060c8f2",
        storageId: 1,
        quantity: "",
        stockinDate: "",
      });
      setIsDialogOpen(false);

      // Show success toast
      toast.success("Lot request submitted successfully");
    } catch (error) {
      console.error("Error submitting lot request:", error);
      toast.error("Failed to submit lot request");
    }
  };

  const addLotRequest = () => {
    setIsDialogOpen(true);
  };

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
                Add Lots
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "search" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("search")}
              >
                <SearchIcon size={20} />
                Search Lots & Items
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
          {activeTab === "lots" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Lot Requests</h2>
                  <Button onClick={addLotRequest} className="mb-4">Add Lot Request</Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotRequests.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell>{lot.item}</TableCell>
                          <TableCell>{lot.quality}</TableCell>
                          <TableCell>Pending</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Approved Lots & Storage</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Lot ID</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Stock-in Date</TableHead>
                        <TableHead>Storage Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedLots.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell>{lot.id}</TableCell>
                          <TableCell>{lot.lotId}</TableCell>
                          <TableCell>{lot.item}</TableCell>
                          <TableCell>{lot.quantity}</TableCell>
                          <TableCell>{lot.quality}</TableCell>
                          <TableCell>{lot.expiryDate}</TableCell>
                          <TableCell>{lot.stockinDate}</TableCell>
                          <TableCell>{lot.storage}</TableCell>
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
                          <p><strong>Storage:</strong> {item.storageName}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Price:</strong> ${item.price}</p>
                          <p><strong>Expiry Date:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
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
                <Label htmlFor="item">Item</Label>
                <Select
                  value={newLotData.itemId}
                  onValueChange={(value) =>
                    setNewLotData(prev => ({ ...prev, itemId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_TYPES.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quality">Quality</Label>
                <Input
                  id="quality"
                  value={newLotData.quality}
                  onChange={(e) =>
                    setNewLotData(prev => ({ ...prev, quality: e.target.value }))
                  }
                  required
                />
              </div>

              <Button type="submit">Submit Lot Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
