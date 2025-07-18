// app/api/menu/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all menu items
export async function GET() {
  const items = await prisma.menu.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

// POST new menu item
export async function POST(req: Request) {
  const { name, price, quantity } = await req.json();
  const item = await prisma.menu.create({
    data: { name, price, quantity },
  });
  return NextResponse.json(item);
}

// PATCH quantity update
export async function PATCH(req: Request) {
  const { id, quantity } = await req.json();
  const updated = await prisma.menu.update({
    where: { id },
    data: { quantity },
  });
  return NextResponse.json(updated);
}

// DELETE a menu item
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.menu.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
