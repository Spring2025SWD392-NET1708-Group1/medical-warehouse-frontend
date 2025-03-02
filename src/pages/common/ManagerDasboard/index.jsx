import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InboxIcon, Search, FileText } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5090/api/lot-request";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [lotRequests, setLotRequests] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storageLocation, setStorageLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLotRequests();
  }, []);

  const fetchLotRequests = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLotRequests(data);
    } catch (error) {
      console.error("Failed to fetch lot requests:", error);
    }
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    setIsDialogOpen(true);
    setStorageLocation("");
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateLotStatus(selectedLot.lotRequestId, 0, 5);
      setIsDialogOpen(false);
      setSelectedLot(null);
      fetchLotRequests(); // Refresh the list after rejection
    } catch (error) {
      console.error("Failed to reject lot request:", error);
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

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manager Menu</h2>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                onClick={() => setActiveTab("requests")}
              >
                <InboxIcon size={20} />
                Lots Request
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "search" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
                onClick={() => setActiveTab("search")}
              >
                <Search size={20} />
                Search Lots & Items
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "report" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
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
                          key={lot.lotRequestId}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRowClick(lot)}
                        >
                          <TableCell>{lot.lotRequestId}</TableCell>
                          <TableCell>{lot.status}</TableCell>
                        </TableRow>
                      ))}
                      {lotRequests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4">No pending requests</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DialogHeader>
                  <DialogTitle>Lot Request Details</DialogTitle>
                </DialogHeader>
                {selectedLot && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Lot ID</Label>
                        <div className="mt-1 font-medium">{selectedLot.lotRequestId}</div>
                      </div>
                      <div>
                        <Label>Item</Label>
                        <div className="mt-1 font-medium">{selectedLot.item.name}</div>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <div className="mt-1 font-medium">{selectedLot.item.quantity}</div>
                      </div>
                      <div>
                        <Label>Quality</Label>
                        <div className="mt-1 font-medium">{selectedLot.quality}</div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storage">Storage Location</Label>
                      <Input
                        id="storage"
                        value={storageLocation}
                        onChange={(e) => setStorageLocation(e.target.value)}
                        className="mt-1"
                        placeholder="Enter storage location ID"
                        type="number"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        onClick={handleApprove}
                        className="bg-green-500 text-white"
                        disabled={!storageLocation.trim() || isLoading}
                      >
                        {isLoading ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
