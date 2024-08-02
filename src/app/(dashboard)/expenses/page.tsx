import { Heading } from '@/components/headings'
import { Divider, Typography } from '@mui/material'
import { CircleDollarSign } from 'lucide-react'
import { PageClient } from './_components/client'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/libs/db'

const Expences = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect('/')
  }

  const expences = await db.expences.findMany({
    where: {
      userId
    },
    include: { budget: true }
  })
  return (
    <div className='flex-col'>
      <div className='flex flex-col md:flex-row items-start justify-start md:items-center md:justify-between'>
        <Heading title='All Expences' description='Manage your expences here' />
      </div>
      <Divider className='my-4' />

      <PageClient expences={expences} />
    </div>
  )
}

export default Expences
