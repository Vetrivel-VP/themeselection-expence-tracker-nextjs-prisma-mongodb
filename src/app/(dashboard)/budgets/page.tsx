import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/libs/db'

import BudgetClient from './_components/budget-client'

const BudgetsPage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const budgets = await db.budgets.findMany({
    where: { userId },
    include: { expences: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className='flex-col'>
      <BudgetClient budgets={budgets} />
    </div>
  )
}

export default BudgetsPage
