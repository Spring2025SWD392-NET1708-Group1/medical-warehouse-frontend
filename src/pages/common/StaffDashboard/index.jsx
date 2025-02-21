import { useState } from "react";
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
import { PlusCircle, Search, FileText } from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("lots");
  const [lotRequests, setLotRequests] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLotData, setNewLotData] = useState({
    lotId: "",
    item: "",
    quantity: "",
    quality: "",
    expiryDate: "",
    stockinDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLot = {
      id: lotRequests.length + 1,
      status: "Pending",
      ...newLotData,
    };
    setLotRequests([...lotRequests, newLot]);
    setIsDialogOpen(false);
    setNewLotData({
      lotId: "",
      item: "",
      quantity: "",
      quality: "",
      expiryDate: "",
      stockinDate: "",
    });

    toast.success("Lot request has been sent to Manager");
  };

  const addLotRequest = () => {
    setIsDialogOpen(true);
  };

  const reportLot = (id) => {
    setLotRequests(lotRequests.map(lot => lot.id === id ? { ...lot, status: "Reported" } : lot));
  };

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

          {activeTab === "lots" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">Lot Requests</h2>
                  <Button onClick={addLotRequest} className="mb-4">Add Lot Request</Button>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lotRequests.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell>{lot.id}</TableCell>
                          <TableCell>{lot.lotId}</TableCell>
                          <TableCell>{lot.item}</TableCell>
                          <TableCell>{lot.quantity}</TableCell>
                          <TableCell>{lot.quality}</TableCell>
                          <TableCell>{lot.expiryDate}</TableCell>
                          <TableCell>{lot.stockinDate}</TableCell>
                          <TableCell>{lot.status}</TableCell>
                          <TableCell>
                            {lot.status === "Pending" && (
                              <Button variant="destructive" onClick={() => reportLot(lot.id)}>Report</Button>
                            )}
                          </TableCell>
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
            <div className="text-center p-8">
              <h2 className="text-xl">Search Lots & Items Component</h2>
              <p>Search functionality coming soon...</p>
            </div>
          )}

          {activeTab === "report" && (
            <div className="text-center p-8">
              <h2 className="text-xl">Report Component</h2>
              <p>Report functionality coming soon...</p>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Lot Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lotId">Lot ID</Label>
                <Input
                  id="lotId"
                  value={newLotData.lotId}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, lotId: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="item">Item</Label>
                <Input
                  id="item"
                  value={newLotData.item}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, item: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newLotData.quantity}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quality">Quality</Label>
                <Input
                  id="quality"
                  value={newLotData.quality}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, quality: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newLotData.expiryDate}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, expiryDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockinDate">Stock-in Date</Label>
                <Input
                  id="stockinDate"
                  type="date"
                  value={newLotData.stockinDate}
                  onChange={(e) =>
                    setNewLotData({ ...newLotData, stockinDate: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
