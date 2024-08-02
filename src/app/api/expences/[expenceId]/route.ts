import { db } from '@/libs/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const DELETE = async (req: Request, { params }: { params: { expenceId: string } }) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Un-Authorized', { status: 401 })
    }

    if (!params.expenceId) {
      return new NextResponse('Id is missing', { status: 400 })
    }

    const expence = await db.expences.findUnique({
      where: {
        id: params.expenceId
      }
    })

    if (!expence) {
      return new NextResponse('Data Not Found', { status: 400 })
    }

    const deleted = await db.expences.delete({
      where: {
        id: params.expenceId
      }
    })

    return NextResponse.json({ message: 'Expence Delete Success fully' })
  } catch (error) {
    console.log(`[EXPENSE_POST] : ${error}`)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
