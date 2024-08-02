'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

interface AwardProps {
  totalBudgetAmount: string
  totalExpenses: string
  savings: string
  percentageUsed: string
  name: string
}

const Award = ({ totalBudgetAmount, totalExpenses, savings, percentageUsed, name }: AwardProps) => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-2 relative items-start'>
        <div>
          <Typography variant='h5'>Congratulations {name}! 🎉</Typography>
          <Typography>Your savings overview</Typography>
        </div>
        <div>
          <Typography variant='h4' color='primary'>
            ${savings}
          </Typography>
          <Typography>
            {percentageUsed} of ${totalBudgetAmount} 🚀
          </Typography>
        </div>
        <Link href={'/budgets'}>
          <Button size='small' variant='contained'>
            View All
          </Button>
        </Link>
        <img
          src='/images/pages/trophy.png'
          alt='trophy image'
          height={102}
          className='absolute inline-end-7 bottom-6'
        />
      </CardContent>
    </Card>
  )
}

export default Award
