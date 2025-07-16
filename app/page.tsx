'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">BerryLane Bakery Dashboard</h1>

      <ul className="space-y-2">
        <li>
          <Link href="/inventory" className="text-blue-500 hover:underline">
            📦 Inventory
          </Link>
        </li>
        <li>
          <Link href="/menu" className="text-blue-500 hover:underline">
            🧁 Menu
          </Link>
        </li>
        <li>
          <Link href="/transactions" className="text-blue-500 hover:underline">
            💰 Transactions
          </Link>
        </li>
      </ul>
    </main>
  )
}
