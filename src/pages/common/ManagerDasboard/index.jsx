import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

const STORAGE_TYPES = ["Cold Storage", "Frozen Storage", "Hazardous Storage", "Dry Storage"];
const STORAGE_STATUS = ["Available", "Full", "Maintenance"];

const WarehouseSummary = ({ lots }) => {
  const totalLots = lots.length;
  const storageUsage = STORAGE_TYPES.map(type => ({
    type,
    count: lots.filter(lot => lot.storage === type).length
  }));

  return (
    <Card className="shadow-lg rounded-lg p-4">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Warehouse Summary</h2>
        <p className="text-lg">Total Lots: {totalLots}</p>
        {storageUsage.map(({ type, count }) => (
          <p key={type} className="text-md text-gray-700">{type}: {count} lots</p>
        ))}
      </CardContent>
    </Card>
  );
};

const LotApproval = ({ lot, onApprove }) => {
  return (
    <div className="flex justify-center">
      <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => onApprove(lot.id)}>Approve Lot</Button>
    </div>
  );
};

const ManagerDashboard = () => {
  const [lots, setLots] = useState([
    {
      id: 1, supplier: "MedCorp", storage: "Cold Storage", status: "Pending Approval", items: [
        { name: "Vaccine", quantity: 50 },
        { name: "Insulin", quantity: 30 }
      ]
    },
    {
      id: 2, supplier: "HealthPlus", storage: "Frozen Storage", status: "Pending Approval", items: [
        { name: "Plasma", quantity: 20 }
      ]
    }
  ]);

  const handleApproveLot = (lotId) => {
    setLots(lots.map(lot => lot.id === lotId ? { ...lot, status: "Approved" } : lot));
  };

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manager Dashboard</h1>

      <WarehouseSummary lots={lots} />

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lot Approvals</h2>
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Supplier</th>
              <th className="p-3 border">Storage</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} className="border hover:bg-gray-100">
                <td className="p-3 border">{lot.supplier}</td>
                <td className="p-3 border">{lot.storage}</td>
                <td className="p-3 border text-yellow-600 font-semibold">{lot.status}</td>
                <td className="p-3 border">{lot.items.map(item => `${item.name} (${item.quantity})`).join(", ")}</td>
                <td className="p-3 border text-center">
                  {lot.status === "Pending Approval" && <LotApproval lot={lot} onApprove={handleApproveLot} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;
