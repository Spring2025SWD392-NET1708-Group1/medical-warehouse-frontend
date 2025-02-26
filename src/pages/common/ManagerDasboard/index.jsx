import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InboxIcon, Search, FileText } from "lucide-react";

const API_URL = "http://localhost:5090/api/lot-request";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [lotRequests, setLotRequests] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storageLocation, setStorageLocation] = useState("");

  useEffect(() => {
    fetchLotRequests();
  }, []);

  const fetchLotRequests = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedData = data.map((lot) => ({
        id: lot.lotRequestId,
        lotId: lot.lotRequestId.substring(0, 8).toUpperCase(), // Shortened ID
        status: lot.status === 3 ? "Pending" : "Processed",
        item: lot.item.name,
        quantity: lot.item.quantity,
        quality: lot.quality,
        expiryDate: lot.item.expiryDate.split("T")[0], // Format date
        stockinDate: lot.stockInDate.split("T")[0], // Format date
      }));
      setLotRequests(formattedData);
    } catch (error) {
      console.error("Failed to fetch lot requests:", error);
    }
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    setIsDialogOpen(true);
    setStorageLocation(""); // Reset storage location
  };

  const handleApprove = () => {
    if (storageLocation.trim()) {
      approveLot(selectedLot.id, storageLocation);
      setIsDialogOpen(false);
      setSelectedLot(null);
    }
  };

  const handleReject = () => {
    rejectLot(selectedLot.id);
    setIsDialogOpen(false);
    setSelectedLot(null);
  };

  const approveLot = (id, storage) => {
    setApprovedLots([...approvedLots, { id, storage }]);
    setLotRequests(lotRequests.filter(lot => lot.id !== id));
  };

  const rejectLot = (id) => {
    setLotRequests(lotRequests.filter(lot => lot.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manager Menu</h2>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("requests")}
              >
                <InboxIcon size={20} />
                Lots Request
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "search" ? "bg-primary text-white" : "hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab("search")}
              >
                <Search size={20} />
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
          {activeTab === "requests" && (
            <>
              <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

              <Card className="mb-6">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Pending Lot Requests</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotRequests.map((lot) => (
                        <TableRow
                          key={lot.id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRowClick(lot)}
                        >
                          <TableCell>{lot.id}</TableCell>
                          <TableCell>{lot.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Approved Lots & Storage</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Storage Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedLots.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell>{lot.id}</TableCell>
                          <TableCell>{lot.storage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Lot Request Details</DialogTitle>
              </DialogHeader>
              {selectedLot && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Lot ID</Label>
                      <div className="mt-1">{selectedLot.lotId}</div>
                    </div>
                    <div>
                      <Label>Item</Label>
                      <div className="mt-1">{selectedLot.item}</div>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <div className="mt-1">{selectedLot.quantity}</div>
                    </div>
                    <div>
                      <Label>Quality</Label>
                      <div className="mt-1">{selectedLot.quality}</div>
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <div className="mt-1">{selectedLot.expiryDate}</div>
                    </div>
                    <div>
                      <Label>Stock-in Date</Label>
                      <div className="mt-1">{selectedLot.stockinDate}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="storage">Storage Location</Label>
                    <Input
                      id="storage"
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      className="mt-1"
                      placeholder="Enter storage location"
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleApprove} className="bg-green-500 text-white">
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
