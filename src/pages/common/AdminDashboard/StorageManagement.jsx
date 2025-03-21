import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const API_STORAGE = 'http://localhost:5090/api/storage'
const API_STORAGE_CATEGORY = 'http://localhost:5090/api/storage-category'

const StorageManagement = () => {
  const [storages, setStorages] = useState([])
  const [newStorage, setNewStorage] = useState({ name: '', storageCategoryId: 1, isActive: true })
  const [storageCategories, setStorageCategories] = useState([])
  const [editingStorage, setEditingStorage] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    fetchStorages()
    fetchStorageCategories()
  }, [])

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

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedStorages = [...storages].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
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
  )
}

export default StorageManagement
