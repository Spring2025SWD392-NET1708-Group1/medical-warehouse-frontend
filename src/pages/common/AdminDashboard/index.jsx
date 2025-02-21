import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Users, Search, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "users" ? "bg-primary text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <Users size={20} />
                User Management
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "search" ? "bg-primary text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("search")}
              >
                <Search size={20} />
                Search Lots & Items
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "report" ? "bg-primary text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("report")}
              >
                <FileText size={20} />
                Report
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "users" && (
            <div className="text-center p-8">
              <h2 className="text-xl">User Management Component</h2>
              <p>User management functionality coming soon...</p>
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
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
