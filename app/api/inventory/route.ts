import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

export async function GET(){
    const inventory = await prisma.inventoryItem.findMany()
    return NextResponse.json(inventory)
}

export async function POST(req: NextRequest){
    const body = await req.json()
    const { name, quantity, unit } = body

    const newItem = await prisma.inventoryItem.create({
        data: {
            name,
            quantity: parseFloat(quantity),
            unit
        }
    })

    return NextResponse.json(newItem, { status: 201 })
}

export async function PATCH(req: NextRequest){
    const body = await req.json()
    const { id, quantity } = body

    const updatedItem = await prisma.inventoryItem.update({
        where: { id: parseInt(id) },
        data: { quantity: parseInt(quantity)}
    })

    return NextResponse.json(updatedItem)
}

export async function DELETE(req: NextRequest){
    const body = await req.json()
    const { id } = body

    try{
        const deletedItem = await prisma.inventoryItem.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json(deletedItem)
    } catch (error) {
        return NextResponse.json({ error: "Item not found."}, { status: 404})
    }
}