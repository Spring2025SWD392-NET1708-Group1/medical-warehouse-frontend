import React from "react";

const MedicalItemList = () => {
  const medicalItems = [
    {
      id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer",
      price: 5.99,
      quantity: 50,
      expiryDate: "2026-08-15",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    },
    {
      id: 2,
      name: "Amoxicillin",
      description: "Antibiotic for bacterial infections",
      price: 12.49,
      quantity: 30,
      expiryDate: "2025-11-20",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
    },
    {
      id: 3,
      name: "Ibuprofen",
      description: "Nonsteroidal anti-inflammatory drug (NSAID)",
      price: 8.99,
      quantity: 40,
      expiryDate: "2027-02-10",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    },
    {
      id: 4,
      name: "Vitamin C",
      description: "Boosts immune system and skin health",
      price: 4.99,
      quantity: 100,
      expiryDate: "2028-05-30",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Medical Supplies</h2>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {medicalItems.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm">Stock: {item.quantity}</span>
              </div>

              <p className="text-gray-500 text-xs mt-2">Expiry: {item.expiryDate}</p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalItemList;
