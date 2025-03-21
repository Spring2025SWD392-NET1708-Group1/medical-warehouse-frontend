import { useState, useEffect } from 'react'
import axios from 'axios'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Users, Search, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const API_URL = 'http://localhost:5090/api/user'
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
  const [newStorage, setNewStorage] = useState({ name: '', storageCategoryId: 1, isActive: true })
  const [storageCategories, setStorageCategories] = useState([])
  const [editingStorage, setEditingStorage] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [storageCategoriesTab, setStorageCategoriesTab] = useState([])
  const [newStorageCategory, setNewStorageCategory] = useState({ name: '' })
  const [editingStorageCategory, setEditingStorageCategory] = useState(null)
  const [sortConfigCategory, setSortConfigCategory] = useState({ key: null, direction: 'asc' })

  const sortedStorages = [...storages].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedStorageCategories = [...storageCategoriesTab].sort((a, b) => {
    if (!sortConfigCategory.key) return 0
    const aValue = a[sortConfigCategory.key]
    const bValue = b[sortConfigCategory.key]
    if (aValue < bValue) return sortConfigCategory.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfigCategory.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSortCategory = (key) => {
    setSortConfigCategory((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'storage') {
      fetchStorages()
      fetchStorageCategories()
    } else if (activeTab === 'storageCategory') {
      fetchStorageCategoriesTab()
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

  const fetchStorageCategoriesTab = async () => {
    try {
      const response = await axios.get(API_STORAGE_CATEGORY)
      setStorageCategoriesTab(response.data)
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

  const updateStorage = async (id, updatedStorage) => {
    try {
      const response = await axios.put(`${API_STORAGE}/${id}`, updatedStorage)
      const category = storageCategories.find((cat) => cat.id === updatedStorage.storageCategoryId)
      const updatedStorageWithCategory = {
        ...response.data,
        storageCategoryName: category ? category.name : 'Unknown',
      }
      setStorages((prevStorages) => prevStorages.map((storage) => (storage.id === id ? updatedStorageWithCategory : storage)))
      setEditingStorage(null)
    } catch (error) {
      console.error('Error updating storage:', error)
    }
  }

  const createStorageCategory = async () => {
    try {
      const response = await axios.post(API_STORAGE_CATEGORY, newStorageCategory)
      setStorageCategoriesTab([...storageCategoriesTab, response.data])
      setNewStorageCategory({ name: '' })
    } catch (error) {
      console.error('Error creating storage category:', error)
    }
  }

  const deleteStorageCategory = async (id) => {
    try {
      await axios.delete(`${API_STORAGE_CATEGORY}/${id}`)
      setStorageCategoriesTab(storageCategoriesTab.filter((category) => category.id !== id))
    } catch (error) {
      console.error('Error deleting storage category:', error)
    }
  }

  const updateStorageCategory = async (id, updatedCategory) => {
    try {
      const response = await axios.put(`${API_STORAGE_CATEGORY}/${id}`, updatedCategory)
      setStorageCategoriesTab((prevCategories) => prevCategories.map((category) => (category.id === id ? response.data : category)))
      setEditingStorageCategory(null)
    } catch (error) {
      console.error('Error updating storage category:', error)
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

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'users' && (
            <div className="p-6 flex-1 w-full overflow-auto bg-white rounded-lg shadow-md border border-gray-300">
              <h2 className="text-xl font-bold mb-4">User Management</h2>

              {/* Form to add new user */}
              <div className="mb-4 flex gap-2">
                <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-1/3" />
                <Input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-1/3" />
                <Button onClick={createUser} className="bg-primary text-white">
                  Add User
                </Button>
              </div>

              {/* User table */}
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

              <div className="mb-4 flex gap-2">
                <Input placeholder="Storage Name" value={newStorage.name} onChange={(e) => setNewStorage({ ...newStorage, name: e.target.value })} className="w-1/3" />
                <Select value={newStorage.storageCategoryId.toString()} onValueChange={(value) => setNewStorage({ ...newStorage, storageCategoryId: parseInt(value) })}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newStorage.isActive.toString()} onValueChange={(value) => setNewStorage({ ...newStorage, isActive: value === 'true' })}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={createStorage} variant="default">
                  Add Storage
                </Button>
              </div>

              {/* Storage table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead onClick={() => handleSort('storageCategoryName')}>Category {sortConfig.key === 'storageCategoryName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead onClick={() => handleSort('isActive')}>Status {sortConfig.key === 'isActive' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStorages.map((storage) => (
                    <TableRow key={storage.id}>
                      <TableCell>{storage.id}</TableCell>
                      <TableCell>
                        {editingStorage?.id === storage.id ? <Input value={editingStorage.name} onChange={(e) => setEditingStorage({ ...editingStorage, name: e.target.value })} /> : storage.name}
                      </TableCell>
                      <TableCell>
                        {editingStorage?.id === storage.id ? (
                          <Select value={editingStorage.storageCategoryId.toString()} onValueChange={(value) => setEditingStorage({ ...editingStorage, storageCategoryId: parseInt(value) })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {storageCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          storage.storageCategoryName
                        )}
                      </TableCell>
                      <TableCell>
                        {editingStorage?.id === storage.id ? (
                          <Select value={editingStorage.isActive.toString()} onValueChange={(value) => setEditingStorage({ ...editingStorage, isActive: value === 'true' })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : storage.isActive ? (
                          <span className="text-green-600 font-bold">Active</span>
                        ) : (
                          <span className="text-red-600 font-bold">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingStorage?.id === storage.id ? (
                          <>
                            <Button onClick={() => updateStorage(storage.id, editingStorage)} variant="success">
                              Save
                            </Button>
                            <Button onClick={() => setEditingStorage(null)} variant="secondary" className="ml-2">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() =>
                                setEditingStorage({
                                  ...storage,
                                  storageCategoryId: storage.storageCategoryId || storageCategories.find((cat) => cat.name === storage.storageCategoryName)?.id || 0,
                                })
                              }
                              variant="warning"
                            >
                              Modify
                            </Button>
                            <Button onClick={() => deleteStorage(storage.id)} variant="destructive" className="ml-2">
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'storageCategory' && (
            <div className="p-6 flex-1 w-full overflow-auto bg-white rounded-lg shadow-md border border-gray-300">
              <h2 className="text-xl font-bold mb-4">Storage Category Management</h2>

              {/* Form to add new storage category */}
              <div className="mb-4 flex gap-2">
                <Input placeholder="Category Name" value={newStorageCategory.name} onChange={(e) => setNewStorageCategory({ ...newStorageCategory, name: e.target.value })} className="w-2/3" />
                <Button onClick={createStorageCategory} variant="default">
                  Add Category
                </Button>
              </div>

              {/* Storage Category table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSortCategory('id')}>ID {sortConfigCategory.key === 'id' ? (sortConfigCategory.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead onClick={() => handleSortCategory('name')}>Name {sortConfigCategory.key === 'name' ? (sortConfigCategory.direction === 'asc' ? '↑' : '↓') : ''}</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStorageCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        {editingStorageCategory?.id === category.id ? (
                          <Input value={editingStorageCategory.name} onChange={(e) => setEditingStorageCategory({ ...editingStorageCategory, name: e.target.value })} />
                        ) : (
                          category.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingStorageCategory?.id === category.id ? (
                          <>
                            <Button onClick={() => updateStorageCategory(category.id, editingStorageCategory)} variant="success">
                              Save
                            </Button>
                            <Button onClick={() => setEditingStorageCategory(null)} variant="secondary" className="ml-2">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => setEditingStorageCategory(category)} variant="warning">
                              Modify
                            </Button>
                            <Button onClick={() => deleteStorageCategory(category.id)} variant="destructive" className="ml-2">
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
