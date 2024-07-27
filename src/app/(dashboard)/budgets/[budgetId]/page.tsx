import { CustomBreadCrumb } from '@/components/custom-bread-crumbs'
import { Heading } from '@/components/headings'
import { db } from '@/libs/db'
import { auth } from '@clerk/nextjs/server'
import { Divider } from '@mui/material'
import { Home } from 'lucide-react'
import { redirect } from 'next/navigation'
import { PageClient } from './_components/client'

const ExpencePage = async ({ params }: { params: { budgetId: string } }) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/')
  }

  const budget = await db.budgets.findUnique({
    where: { userId, id: params.budgetId },
    include: { expences: true }
  })

  if (!budget) {
    redirect('/budgets')
  }

  return (
    <div className='flex-col p-2 md:p-4'>
      <CustomBreadCrumb breadCrumbPage={budget?.name || ''} breadCrumbItem={[{ label: 'Budgets', link: '/budgets' }]} />

      <div className='mt-6'>
        <Heading title='My Expences' description='Manage all your expences in a single place' />
      </div>

      <Divider className='my-4' />

      <PageClient budget={budget} />
    </div>
  )
}

export default ExpencePage
