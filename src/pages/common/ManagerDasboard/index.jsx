import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const ManagerDashboard = () => {
  const [lotRequests, setLotRequests] = useState([
    { id: 1, status: "Pending" },
    { id: 2, status: "Pending" }
  ]);
  const [approvedLots, setApprovedLots] = useState([]);

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
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

          {/* Lot Requests */}
          <Card className="mb-6">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Pending Lot Requests</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lotRequests.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell>{lot.id}</TableCell>
                      <TableCell>{lot.status}</TableCell>
                      <TableCell className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="text"
                          placeholder="Storage Location"
                          className="p-2 border rounded"
                          onChange={(e) => lot.storage = e.target.value}
                        />
                        <Button onClick={() => approveLot(lot.id, lot.storage)} className="bg-green-500 text-white">Approve</Button>
                        <Button variant="destructive" onClick={() => rejectLot(lot.id)}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Approved Lots */}
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;
