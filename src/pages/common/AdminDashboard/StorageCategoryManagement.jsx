import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

const API_STORAGE_CATEGORY = 'http://localhost:5090/api/storage-category'

const StorageCategoryManagement = () => {
  const [storageCategoriesTab, setStorageCategoriesTab] = useState([])
  const [newStorageCategory, setNewStorageCategory] = useState({ name: '' })
  const [editingStorageCategory, setEditingStorageCategory] = useState(null)
  const [sortConfigCategory, setSortConfigCategory] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    fetchStorageCategoriesTab()
  }, [])

  const fetchStorageCategoriesTab = async () => {
    try {
      const response = await axios.get(API_STORAGE_CATEGORY)
      setStorageCategoriesTab(response.data)
    } catch (error) {
      console.error('Error fetching storage categories:', error)
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

  const handleSortCategory = (key) => {
    setSortConfigCategory((prevConfig) => ({
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

  return (
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
  )
}

export default StorageCategoryManagement
