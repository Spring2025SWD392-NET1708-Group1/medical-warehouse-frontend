import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
const StaffDashboard = () => {
  const [lotRequests, setLotRequests] = useState([]);
  const [approvedLots, setApprovedLots] = useState([]);

  const addLotRequest = () => {
    const newLot = { id: lotRequests.length + 1, status: "Pending" };
    setLotRequests([...lotRequests, newLot]);
  };

  const reportLot = (id) => {
    setLotRequests(lotRequests.map(lot => lot.id === id ? { ...lot, status: "Reported" } : lot));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Staff Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lot Request Feature */}
            <Card className="w-full">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">Lot Requests</h2>
                <Button onClick={addLotRequest} className="mb-4">Add Lot Request</Button>
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

            {/* Approved Lots */}
            <Card className="w-full">
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
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
