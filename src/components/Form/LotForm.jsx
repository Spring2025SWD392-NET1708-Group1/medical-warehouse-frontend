import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const LotForm = ({ onSubmit, onCancel }) => {
  const [lot, setLot] = useState({
    supplier: "",
    storage: "Cold",
    quantity: "",
    expiry: "",
  });

  const handleChange = (e) => {
    setLot({ ...lot, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(lot);
  };

  return (
    <Card className="mt-6 p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Add New Lot</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            type="text"
            name="supplier"
            placeholder="Supplier Name"
            value={lot.supplier}
            onChange={handleChange}
            required
          />
          <Select name="storage" value={lot.storage} onChange={handleChange}>
            <SelectItem value="Cold">Cold Storage</SelectItem>
            <SelectItem value="Normal">Normal Storage</SelectItem>
          </Select>
          <Input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={lot.quantity}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="expiry"
            value={lot.expiry}
            onChange={handleChange}
            required
          />

          <div className="flex gap-2">
            <Button type="submit">Submit</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LotForm;
