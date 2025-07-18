'use client'

import { useEffect, useState } from 'react'

type MenuItem = {
  id: number
  name: string
  price: number
  createdAt: string
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])

  const fetchItems = async () => {
    const res = await fetch('/api/menu')
    const data = await res.json()
    setItems(data)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const price = (form.elements.namedItem('price') as HTMLInputElement).value

    const res = await fetch('/api/menu', {
      method: 'POST',
      body: JSON.stringify({ name, price }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      form.reset()
      fetchItems()
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      fetchItems()
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="p-4 overflow-y-auto max-h-[80vh]">
      <h1 className="text-xl font-bold mb-4">Menu</h1>

      <form onSubmit={handleAdd} className="mb-6">
        <input
          name="name"
          placeholder="Item name"
          required
          className="border border-gray-300 px-2 py-1 mr-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          required
          className="border border-gray-300 px-2 py-1 mr-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-b pb-2">
            <p><strong>id:</strong> {item.id}</p>
            <p><strong>name:</strong> {item.name}</p>
            <p><strong>price:</strong> {item.price}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-1 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
