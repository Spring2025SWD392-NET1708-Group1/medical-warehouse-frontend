// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockLotRequests = [
  { 
    id: 1, 
    status: "Pending",
    lotId: "LOT001",
    item: "Rice",
    quantity: 1000,
    quality: "A",
    expiryDate: "2024-12-31",
    stockinDate: "2024-03-20"
  },
  { 
    id: 2, 
    status: "Pending",
    lotId: "LOT002",
    item: "Wheat",
    quantity: 500,
    quality: "B",
    expiryDate: "2024-10-15",
    stockinDate: "2024-03-21"
  },
];

const mockApprovedLots = [];

// Mock API endpoints
export const api = {
  // Fetch lot requests
  getLotRequests: async () => {
    await delay(500); // Simulate network delay
    return mockLotRequests;
  },

  // Fetch approved lots
  getApprovedLots: async () => {
    await delay(500);
    return mockApprovedLots;
  },

  // Approve a lot
  approveLot: async (id, storageLocation) => {
    await delay(500);
    const lot = mockLotRequests.find(lot => lot.id === id);
    if (lot) {
      mockApprovedLots.push({ ...lot, storage: storageLocation });
      const index = mockLotRequests.findIndex(l => l.id === id);
      mockLotRequests.splice(index, 1);
    }
    return { success: true };
  },

  // Reject a lot
  rejectLot: async (id) => {
    await delay(500);
    const index = mockLotRequests.findIndex(lot => lot.id === id);
    if (index !== -1) {
      mockLotRequests.splice(index, 1);
    }
    return { success: true };
  },

  // Create a new lot request
  createLotRequest: async (lotData) => {
    await delay(500);
    const newLot = {
      id: mockLotRequests.length + 1,
      status: "Pending",
      ...lotData
    };
    mockLotRequests.push(newLot);
    return newLot;
  },
}; 