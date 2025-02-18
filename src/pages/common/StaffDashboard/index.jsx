import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LotForm from "@/components/Form/LotForm";

const STORAGE_TYPES = ["Cold Storage", "Frozen Storage", "Hazardous Storage", "Dry Storage"];

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

const StaffDashboard = () => {
  const [lots, setLots] = useState([
    { id: 1, supplier: "MedCorp", storage: "Cold Storage", quantity: 100, expiry: "2025-12-01" },
    { id: 2, supplier: "HealthPlus", storage: "Normal Storage", quantity: 200, expiry: "2026-01-15" },
  ]);
  const [showForm, setShowForm] = useState(false);

  const handleNewLot = (newLot) => {
    setLots([...lots, { id: lots.length + 1, ...newLot }]);
    setShowForm(false);
  };

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Staff Dashboard</h1>

      <WarehouseSummary lots={lots} />

      <h2 className="text-2xl font-semibold mt-6 mb-4">Received Lots</h2>
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Supplier</th>
              <th className="p-3 border">Storage</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} className="border hover:bg-gray-100">
                <td className="p-3 border">{lot.supplier}</td>
                <td className="p-3 border">{lot.storage}</td>
                <td className="p-3 border">{lot.quantity}</td>
                <td className="p-3 border">{lot.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={() => setShowForm(true)} className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Add New Lot
      </Button>

      {showForm && <LotForm onSubmit={handleNewLot} onCancel={() => setShowForm(false)} />}
    </div>
  );
};

export default StaffDashboard;
