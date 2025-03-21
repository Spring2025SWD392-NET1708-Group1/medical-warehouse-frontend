import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

const API_URL = 'http://localhost:5090/api/user'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ name: '', email: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

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

  return (
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
  )
}

export default UserManagement
