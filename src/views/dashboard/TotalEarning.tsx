// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'

import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import { Budgets, Expences } from '@prisma/client'
import { formatNumber } from '../../../actions/analytics'

type DataType = {
  title: string
  imgSrc: string
  amount: string
  progress: number
  subtitle: string
  color?: ThemeColor
}

// Vars
const data: DataType[] = [
  {
    progress: 75,
    title: 'Zipcar',
    amount: '$24,895.65',
    subtitle: 'Vuejs, React & HTML',
    imgSrc: '/images/cards/zipcar.png'
  },
  {
    progress: 50,
    color: 'info',
    title: 'Bitbank',
    amount: '$8,650.20',
    subtitle: 'Sketch, Figma & XD',
    imgSrc: '/images/cards/bitbank.png'
  },
  {
    progress: 20,
    title: 'Aviato',
    color: 'secondary',
    amount: '$1,245.80',
    subtitle: 'HTML & Angular',
    imgSrc: '/images/cards/aviato.png'
  }
]

interface BudgetClientProps {
  budgets: (Budgets & { expences: Expences[] })[]
  percentageUsed: string
}

const TotalEarning = ({ budgets, percentageUsed }: BudgetClientProps) => {
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
    <Card>
      <CardHeader title='Budgets'></CardHeader>
      <CardContent className='flex flex-col gap-11 md:mbs-2.5'>
        <div>
          <div className='flex items-center'>
            <Typography variant='h3'>${formatNumber(overallbudgetsum)}</Typography>
            <i className='ri-arrow-up-s-line align-bottom text-success'></i>
            <Typography component='span' color='success.main'>
              {percentageUsed} (used)
            </Typography>
          </div>
          <Typography>
            Overall expences - ${formatNumber(totalExpenses)} | Remaining Budget : ${formatNumber(remainingBudget)}
          </Typography>
        </div>
        <div className='flex flex-col gap-6'>
          {budgets.map((item, index) => (
            <div key={index} className='flex items-center gap-3'>
              {/* <Avatar src={item.icon} variant='rounded' className='bg-actionHover' /> */}
              <Typography variant='h2' color='text.primary' className='font-medium'>
                {item.icon}
              </Typography>
              <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                <div className='flex flex-col gap-0.5'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.name}
                  </Typography>
                  <Typography>Total Expences : {item.expences.length}</Typography>
                </div>
                <div className='flex flex-col gap-2 items-center'>
                  <Typography color='text.primary' className='font-medium'>
                    ${formatNumber(parseFloat(item.amount))}
                  </Typography>
                  <BudgetProgress budget={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface BudgetCardItemProps {
  budget: Budgets & { expences: Expences[] }
}

const BudgetProgress = ({ budget }: BudgetCardItemProps) => {
  // Calculate total expenses
  const totalExpenses = budget.expences.reduce((total, expence) => {
    const amount = parseFloat(expence.amount) || 0
    return total + amount
  }, 0)

  // Calculate the budget amount and remaining amount
  const budgetAmount = parseFloat(budget.amount) || 0
  const remainingAmount = budgetAmount - totalExpenses

  // Calculate the percentage of the budget used
  const progress = budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0
  return <LinearProgress variant='determinate' value={progress} className='is-20 bs-1' color={'primary'} />
}

export default TotalEarning
