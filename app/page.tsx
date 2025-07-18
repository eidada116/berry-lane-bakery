"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function HomePage() {
  const [view, setView] = useState<"inventory" | "menu" | "transactions" | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!view || !["inventory", "menu", "transactions"].includes(view)) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/${view}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  const reloadData = async () => {
    if (!view) return;
    const res = await fetch(`/api/${view}`);
    const json = await res.json();
    setData(json);
  };

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (!view) return <p>Welcome! Click a button to view a section.</p>;

    return (
      <div>
        <h2 className="text-lg font-bold capitalize mb-4">{view}</h2>

        {view === "inventory" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;
              const unit = (form.elements.namedItem("unit") as HTMLInputElement).value;

              try {
                await fetch("/api/inventory", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, quantity: Number(quantity), unit }),
                });
                form.reset();
                await reloadData();
              } catch (err) {
                console.error("Failed to add inventory item:", err);
              }
            }}
            className="mb-4 space-y-2"
          >
            <div>
              <input name="name" placeholder="Item name" className="border p-2 mr-2 rounded" required />
              <input name="quantity" type="number" placeholder="Quantity" className="border p-2 mr-2 rounded" required />
              <input name="unit" placeholder="Unit (e.g. pcs, kg)" className="border p-2 mr-2 rounded" required />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </form>
        )}

        {view === "menu" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const price = (form.elements.namedItem("price") as HTMLInputElement).value;
              const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;

              try {
                await fetch("/api/menu", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, price: Number(price), quantity: Number(quantity) }),
                });
                form.reset();
                await reloadData();
              } catch (err) {
                console.error("Failed to add menu item:", err);
              }
            }}
            className="mb-4 space-y-2"
          >
            <div>
              <input name="name" placeholder="Item name" className="border p-2 mr-2 rounded" required />
              <input name="price" type="number" placeholder="Price" className="border p-2 mr-2 rounded" required />
              <input name="quantity" type="number" placeholder="Quantity" className="border p-2 mr-2 rounded" required />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Item</button>
            </div>
          </form>
        )}

        {data.length === 0 ? (
          <p>No data found for {view}</p>
        ) : (
          <ul className="list-disc ml-4">
            {data.map((item, index) => (
              <li key={index} className="mb-4 border p-4 rounded shadow-sm">
                <div className="mb-2">
                  <strong>Name:</strong> {item.name}
                  <br />
                  {view === "inventory" && (
                    <>
                      <strong>Quantity:</strong> {item.quantity} {item.unit}
                      <br />
                    </>
                  )}
                  {view === "menu" && (
                    <>
                      <strong>Price:</strong> ₱{item.price}
                      <br />
                      <strong>Quantity:</strong> {item.quantity}
                      <br />
                    </>
                  )}
                </div>

                {(view === "inventory" || view === "menu") && (
                  <div className="space-x-2">
                    <button
                      onClick={async () => {
                        await fetch(`/api/${view}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: item.id, quantity: item.quantity + 1 }),
                        });
                        await reloadData();
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Increase
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(`/api/${view}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: item.id, quantity: item.quantity - 1 }),
                        });
                        await reloadData();
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Decrease
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(`/api/${view}`, {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: item.id }),
                        });
                        await reloadData();
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <main className="main-window flex min-h-screen">
      <div className="top-content">
        <h1 className="text-xl font-bold">🍞 BerryLane Bakery Dashboard</h1>
      </div>
      <div className="content flex w-full">
        <div className="w-1/3 bg-orange-200 p-6 space-y-4">
          <div className="side-buttons">
            <button onClick={() => setView("inventory")} className="button p-2">📦 Inventory</button>
            <button onClick={() => setView("menu")} className="button p-2">🧁 Menu</button>
            <button onClick={() => setView("transactions")} className="button p-2">💰 Transactions</button>
          </div>
        </div>

        <div className="side-content flex-1 p-6 bg-white border-l border-gray-300 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
