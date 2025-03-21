import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

const API_URL = 'http://localhost:5090/api/staff-user'

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '' })

  useEffect(() => {
    fetchStaffs()
  }, [])

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(API_URL)
      setStaffs(response.data)
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const createStaff = async () => {
    try {
      const response = await axios.post(API_URL, newStaff)
      setStaffs([...staffs, response.data])
      setNewStaff({ name: '', email: '', role: '' })
    } catch (error) {
      console.error('Error creating staff:', error)
    }
  }

  const deleteStaff = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setStaffs(staffs.filter((staff) => staff.id !== id))
    } catch (error) {
      console.error('Error deleting staff:', error)
    }
  }

  return (
    <div className="p-6 flex-1 w-full overflow-auto bg-white rounded-lg shadow-md border border-gray-300">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>

      {/* Form to add new staff */}
      <div className="mb-4 flex gap-2">
        <Input placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-1/4" />
        <Input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-1/4" />
        <Input placeholder="Position" value={newStaff.position} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} className="w-1/4" />
        <Button onClick={createStaff} className="bg-primary text-white">
          Add Staff
        </Button>
      </div>

      {/* Staff table */}
      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.id}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteStaff(staff.id)} className="bg-red-500 text-white">
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

export default StaffManagement
