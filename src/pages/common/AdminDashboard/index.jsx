import { useState, useEffect } from 'react'
import axios from 'axios'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Users, Search, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'

const API_URL = 'http://localhost:5090/api/user' // Cập nhật URL phù hợp với API .NET của bạn
const API_ITEMS = 'http://localhost:5090/api/items'
const API_LOT_REQUEST = 'http://localhost:5090/api/lot-request'
const API_STORAGE = 'http://localhost:5090/api/storage'
const API_STORAGE_CATEGORY = 'http://localhost:5090/api/storage-category'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [lots, setLots] = useState([])
  const [storages, setStorages] = useState([])
  const [newStorage, setNewStorage] = useState({ name: '', storageCategoryId: 0, isActive: true })
  const [storageCategories, setStorageCategories] = useState([])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'storage') {
      fetchStorages()
      fetchStorageCategories()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL)
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStorages = async () => {
    try {
      const response = await axios.get(API_STORAGE)
      setStorages(response.data)
    } catch (error) {
      console.error('Error fetching storages:', error)
    }
  }

  const fetchStorageCategories = async () => {
    try {
      const response = await axios.get(API_STORAGE_CATEGORY)
      setStorageCategories(response.data)
    } catch (error) {
      console.error('Error fetching storage categories:', error)
    }
  }

  const createUser = async () => {
    try {
      const response = await axios.post(API_URL, newUser)
      setUsers([...users, response.data])
      setNewUser({ name: '', email: '' })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setUsers(users.filter((user) => user.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
  const searchItemsAndLots = async () => {
    try {
      const [itemsRes, lotsRes] = await Promise.all([axios.get(`${API_ITEMS}?query=${searchQuery}`), axios.get(`${API_LOT_REQUEST}?query=${searchQuery}`)])
      setItems(itemsRes.data)
      setLots(lotsRes.data)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const createStorage = async () => {
    try {
      const response = await axios.post(API_STORAGE, newStorage)
      const category = storageCategories.find((cat) => cat.id === newStorage.storageCategoryId)
      const newStorageWithCategory = {
        ...response.data,
        storageCategoryName: category ? category.name : 'Unknown',
      }
      setStorages([...storages, newStorageWithCategory])
      setNewStorage({ name: '', storageCategoryId: 0, isActive: true })
    } catch (error) {
      console.error('Error creating storage:', error)
    }
  }

  const deleteStorage = async (id) => {
    try {
      await axios.delete(`${API_STORAGE}/${id}`)
      setStorages(storages.filter((storage) => storage.id !== id))
    } catch (error) {
      console.error('Error deleting storage:', error)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen ">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
            <nav className="space-y-2">
              <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`} onClick={() => setActiveTab('users')}>
                <Users size={20} />
                User Management
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'search' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveTab('search')}
              >
                <Search size={20} />
                Search Lots & Items
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'report' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveTab('report')}
              >
                <FileText size={20} />
                Report
              </button>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'storage' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveTab('storage')}
              >
                <FileText size={20} />
                Storage
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'users' && (
            <div className="p-6 flex-1 w-full overflow-auto bg-white rounded-lg shadow-md border border-gray-300">
              <h2 className="text-xl font-bold mb-4">User Management</h2>

              {/* Form thêm người dùng */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-400"
                />
                <button onClick={createUser} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  Add User
                </button>
              </div>

              {/* Bảng danh sách người dùng */}
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100 transition">
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">
                          <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <Input type="text" placeholder="Search items by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
                <Button variant="outline" size="icon" onClick={searchItemsAndLots}>
                  <Search size={20} />
                </Button>
              </div>

              {/* Items Grid */}
              <div>
                <h3 className="text-lg font-bold">Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <Card key={item.id} className="w-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                        <p>
                          <strong>Category:</strong> {item.categoryName}
                        </p>
                        <p>
                          <strong>Storage:</strong> {item.storageName}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> ${item.price}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Lots Grid */}
              <div>
                <h3 className="text-lg font-bold">Lots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {lots.map((lot) => (
                    <Card key={lot.id} className="w-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2">Request Number: {lot.requestNumber}</h3>
                        <p className="text-sm text-gray-600 mb-4">{lot.description}</p>
                        <p>
                          <strong>Status:</strong> {lot.status}
                        </p>
                        <p>
                          <strong>Created At:</strong> {new Date(lot.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="p-6 flex-1 w-full overflow-auto bg-white rounded-lg shadow-md border border-gray-300">
              <h2 className="text-xl font-bold mb-4">Storage Management</h2>

              {/* Form to add new storage */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Storage Name"
                  value={newStorage.name}
                  onChange={(e) => setNewStorage({ ...newStorage, name: e.target.value })}
                  className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={newStorage.storageCategoryId}
                  onChange={(e) => setNewStorage({ ...newStorage, storageCategoryId: parseInt(e.target.value) })}
                  className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-400"
                >
                  <option value={0} disabled>
                    Select Category
                  </option>
                  {storageCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newStorage.isActive}
                  onChange={(e) => setNewStorage({ ...newStorage, isActive: e.target.value === 'true' })}
                  className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button onClick={createStorage} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  Add Storage
                </button>
              </div>

              {/* Storage table */}
              <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storages.map((storage) => (
                    <tr key={storage.id} className="hover:bg-gray-100 transition">
                      <td className="border p-2">{storage.id}</td>
                      <td className="border p-2">{storage.name}</td>
                      <td className="border p-2">{storage.storageCategoryName}</td>
                      <td className="border p-2">{storage.isActive ? <span className="text-green-600 font-bold">Active</span> : <span className="text-red-600 font-bold">Inactive</span>}</td>
                      <td className="border p-2">
                        <button onClick={() => deleteStorage(storage.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="text-center p-8">
              <h2 className="text-xl">Report Component</h2>
              <p>Report functionality coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminDashboard
