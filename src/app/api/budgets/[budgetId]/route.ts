import { db } from '@/libs/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const POST = async (req: Request, { params }: { params: { budgetId: string } }) => {
  try {
    const { userId } = auth()

    const { name, amount } = await req.json()

    if (!userId) {
      return new NextResponse('Un-Authorized', { status: 401 })
    }

    if (!params.budgetId) {
      return new NextResponse('Id is missing', { status: 400 })
    }

    if (!name) {
      return new NextResponse('Expense Title is missing', { status: 400 })
    }

    if (!amount) {
      return new NextResponse('Amount is missing', { status: 400 })
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 })
    }

    const budget = await db.budgets.findUnique({
      where: { id: params.budgetId },
      include: { expences: true }
    })

    if (!budget) {
      return new NextResponse('Budget not found', { status: 404 })
    }

    const totalSpent = budget.expences.reduce((total, expence) => {
      return total + parseFloat(expence.amount)
    }, 0)

    const budgetAmount = parseFloat(budget.amount)

    if (totalSpent + parsedAmount > budgetAmount) {
      return new NextResponse('Not enough amount in the budget', { status: 400 })
    }

    const expense = await db.expences.create({
      data: {
        userId,
        name,
        budgetId: params.budgetId,
        amount: amount.toString() // store as string as per schema
      }
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.log(`[EXPENSE_POST] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const PATCH = async (req: Request, { params }: { params: { budgetId: string } }) => {
  try {
    const { userId } = auth()

    const { name, amount, icon } = await req.json()

    if (!userId) {
      return new NextResponse('Un-Authorized', { status: 401 })
    }

    if (!params.budgetId) {
      return new NextResponse('Id is missing', { status: 400 })
    }

    const budget = await db.budgets.findUnique({
      where: { id: params.budgetId }
    })

    if (!budget) {
      return new NextResponse('Budget not found', { status: 404 })
    }

    const updateData: { name?: string; amount?: string; icon?: string } = {}

    if (name) {
      updateData.name = name
    }

    if (amount) {
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new NextResponse('Invalid amount', { status: 400 })
      }

      // Increment the amount if it exists
      const currentAmount = parseFloat(budget.amount) || 0
      const newAmount = currentAmount + parsedAmount
      updateData.amount = newAmount.toString()
    }

    if (icon) {
      updateData.icon = icon
    }

    const updatedBudget = await db.budgets.update({
      where: { id: params.budgetId },
      data: updateData
    })

    return NextResponse.json(updatedBudget)
  } catch (error) {
    console.log(`[BUDGET_PATCH] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
