import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

export async function GET(){
    const items = await prisma.menuItem.findMany()
    return NextResponse.json(items)
}

export async function POST(req: NextRequest){
    const body = await req.json()
    const { name, price } = body
    
    const newItem = await prisma.menuItem.create({
        data: {name, price: parseFloat(price) }
    })

    return NextResponse.json(newItem, { status: 201 })
}