import React, { useState, useEffect } from "react";

const TrackInventoryMovement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fake API response
  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          item: "Paracetamol",
          type: "import",
          quantity: 20,
          date: "2025-02-10",
          staff: "John Doe",
        },
        {
          id: 2,
          item: "Amoxicillin",
          type: "export",
          quantity: 10,
          date: "2025-02-12",
          staff: "Jane Smith",
        },
        {
          id: 3,
          item: "Ibuprofen",
          type: "import",
          quantity: 30,
          date: "2025-02-14",
          staff: "Michael Lee",
        },
        {
          id: 4,
          item: "Vitamin C",
          type: "export",
          quantity: 15,
          date: "2025-02-15",
          staff: "Emma Watson",
        },
      ];
      setTransactions(data);
    };

    fetchData();
  }, []);

  // Lọc dữ liệu theo loại giao dịch và tìm kiếm sản phẩm
  const filteredTransactions = transactions.filter(
    (t) =>
      (filterType === "all" || t.type === filterType) &&
      t.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track Inventory Movement</h2>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by item name..."
          className="border rounded-lg p-2 w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="import">Import</option>
          <option value="export">Export</option>
        </select>
      </div>

      {/* Bảng lịch sử giao dịch */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Item</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Staff</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t, index) => (
              <tr key={t.id} className="border-b hover:bg-gray-100 transition">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4">{t.item}</td>
                <td
                  className={`py-2 px-4 font-semibold ${
                    t.type === "import" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
                <td className="py-2 px-4 text-center">{t.quantity}</td>
                <td className="py-2 px-4 text-center">{t.date}</td>
                <td className="py-2 px-4">{t.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No transactions found.</p>
      )}
    </div>
  );
};

export default TrackInventoryMovement;
