import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'

const API_ITEMS = 'http://localhost:5090/api/items'
const API_LOT_REQUEST = 'http://localhost:5090/api/lot-request'

const SearchLotsAndItems = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [lots, setLots] = useState([])

  const searchItemsAndLots = async () => {
    try {
      const [itemsRes, lotsRes] = await Promise.all([axios.get(`${API_ITEMS}?query=${searchQuery}`), axios.get(`${API_LOT_REQUEST}?query=${searchQuery}`)])
      setItems(itemsRes.data)
      setLots(lotsRes.data)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  return (
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
  )
}

export default SearchLotsAndItems
