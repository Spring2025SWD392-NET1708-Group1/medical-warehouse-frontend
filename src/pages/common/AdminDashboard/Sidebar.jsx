import { Users, Search, FileText } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-100 border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
        <nav className="space-y-2">
          <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`} onClick={() => setActiveTab('users')}>
            <Users size={20} />
            User Management
          </button>
          <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'search' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`} onClick={() => setActiveTab('search')}>
            <Search size={20} />
            Search Lots & Items
          </button>
          <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'report' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`} onClick={() => setActiveTab('report')}>
            <FileText size={20} />
            Report
          </button>
          <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'storage' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`} onClick={() => setActiveTab('storage')}>
            <FileText size={20} />
            Storage
          </button>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'storageCategory' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('storageCategory')}
          >
            <FileText size={20} />
            Storage Category
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
