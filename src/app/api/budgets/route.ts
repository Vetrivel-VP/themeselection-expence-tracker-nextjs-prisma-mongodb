import { db } from '@/libs/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const { userId } = auth()

    const { name, icon, amount } = await req.json()

    if (!userId) {
      return new NextResponse('Un-Authorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Budget Title is missing', { status: 401 })
    }

    if (!icon) {
      return new NextResponse('Icon is missing', { status: 401 })
    }

    if (!amount) {
      return new NextResponse('Amount is missing', { status: 401 })
    }

    const budget = await db.budgets.create({
      data: {
        userId,
        name,
        icon,
        amount
      }
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.log(`[BUDGET_POST] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
