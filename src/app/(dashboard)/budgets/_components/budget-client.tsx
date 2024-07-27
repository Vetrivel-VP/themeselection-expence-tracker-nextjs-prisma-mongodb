import { Heading } from '@/components/headings'
import { Divider, Grid, Typography } from '@mui/material'
import { CreateBudget } from './create-budget'
import { Budgets, Expences } from '@prisma/client'
import { BudgetCardItem } from './budget-card-item'
import { CircleDollarSign } from 'lucide-react'

interface BudgetClientProps {
  budgets: (Budgets & { expences: Expences[] })[]
}

const BudgetClient = ({ budgets }: BudgetClientProps) => {
  // Calculate the overall budget sum
  const overallbudgetsum = budgets.reduce((total, budget) => {
    const amount = parseFloat(budget.amount) || 0
    return total + amount
  }, 0)

  // Calculate the total expenses
  const totalExpenses = budgets.reduce((total, budget) => {
    const budgetExpenses = budget.expences.reduce((expTotal, expense) => {
      const amount = parseFloat(expense.amount) || 0
      return expTotal + amount
    }, 0)
    return total + budgetExpenses
  }, 0)

  // Calculate the remaining overall budget
  const remainingBudget = overallbudgetsum - totalExpenses

  return (
    <div className='flex-col'>
      <div className='flex flex-col md:flex-row items-start justify-start md:items-center md:justify-between'>
        <Heading title='My Budgets' description='Manage your budgets here' />
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Typography variant='body1'>Budget:</Typography>
            <Typography variant='h4' className='flex items-center'>
              <CircleDollarSign className='w-6 h-6 mr-1 text-purple-600' /> {overallbudgetsum.toFixed(2)}
            </Typography>
          </div>
          <div className='flex items-center gap-2'>
            <Typography variant='body1'>Remaining:</Typography>
            <Typography variant='h4' className='flex items-center'>
              <CircleDollarSign className='w-6 h-6 mr-1 text-green-600' /> {remainingBudget.toFixed(2)}
            </Typography>
          </div>
        </div>
      </div>

      <Divider className='my-6' />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <CreateBudget />
        </Grid>
        {budgets.map(budget => (
          <Grid key={budget.id} item xs={12} md={4}>
            <BudgetCardItem budget={budget} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default BudgetClient
