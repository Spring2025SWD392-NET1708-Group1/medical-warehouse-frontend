import { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar from './Sidebar'
import StorageManagement from './StorageManagement'
import StorageCategoryManagement from './StorageCategoryManagement'
import UserManagement from './UserManagement'
import StaffManagement from './StaffManagement'
import SearchLotsAndItems from './SearchLotsAndItems'
import Report from './Report'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'search' && <SearchLotsAndItems />}
          {activeTab === 'storageCategory' && <StorageCategoryManagement />}
          {activeTab === 'report' && <Report />}
          {activeTab === 'storage' && <StorageManagement />}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
