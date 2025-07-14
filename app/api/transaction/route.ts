import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

export async function GET(){
    const transaction = await prisma.transaction.findMany()
    return NextResponse.json(transaction)
}

export async function POST(req: NextRequest){
    const body = await req.json()
    const { type, itemName, quantity, totalAmount } = body

    const newTransaction = await prisma.transaction.create({
        data: {
            type,
            itemName,
            quantity: parseInt(quantity),
            totalAmount: parseFloat(totalAmount)
        }
    })

    return NextResponse.json(newTransaction, { status: 201 })
}