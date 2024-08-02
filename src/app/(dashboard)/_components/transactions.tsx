'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Props type for the component
interface TransactionsProps {
  currentMonth: {
    totalBudgetAmount: string
    totalExpenses: string
    savings: string
    percentageUsed: string
    monthName: string
  }
  previousMonth: {
    totalBudgetAmount: string
    totalExpenses: string
    savings: string
    percentageUsed: string
    monthName: string
  }
}

// Component
const Transactions = ({ currentMonth, previousMonth }: TransactionsProps) => {
  // Prepare data
  const data = [
    {
      stats: `$${currentMonth.totalBudgetAmount}`,
      title: `Budget (${currentMonth.monthName})`,
      color: 'primary' as ThemeColor,
      icon: 'ri-pie-chart-2-line'
    },
    {
      stats: `$${currentMonth.totalExpenses}`,
      title: 'Expenses',
      color: 'warning' as ThemeColor,
      icon: 'ri-group-line'
    },
    {
      stats: `$${currentMonth.savings}`,
      title: 'Savings',
      color: 'success' as ThemeColor,
      icon: 'ri-money-dollar-circle-line'
    },
    {
      stats: currentMonth.percentageUsed,
      title: 'Used Percentage',
      color: 'info' as ThemeColor,
      icon: 'ri-macbook-line'
    },
    {
      stats: `$${previousMonth.totalBudgetAmount}`,
      title: `Budget (${previousMonth.monthName})`,
      color: 'primary' as ThemeColor,
      icon: 'ri-pie-chart-2-line'
    },
    {
      stats: `$${previousMonth.totalExpenses}`,
      title: 'Expenses',
      color: 'warning' as ThemeColor,
      icon: 'ri-group-line'
    },
    {
      stats: `$${previousMonth.savings}`,
      title: 'Savings',
      color: 'success' as ThemeColor,
      icon: 'ri-money-dollar-circle-line'
    },
    {
      stats: previousMonth.percentageUsed,
      title: 'Used Percentage',
      color: 'info' as ThemeColor,
      icon: 'ri-macbook-line'
    }
  ]

  const router = useRouter()

  const handleRefresh = async () => {
    router.refresh()
    toast.success('Data Reloaded')
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Budget Comparison Overview'
        action={
          <OptionMenu
            iconClassName='text-textPrimary'
            options={[{ text: 'Refresh', menuItemProps: { onClick: handleRefresh } }]}
          />
        }
        subheader={
          <p className='mbs-3'>
            <span className='font-medium text-textPrimary'>
              Comparison between {currentMonth.monthName} and {previousMonth.monthName} Month
            </span>
          </p>
        }
      />
      <CardContent className='!pbs-5'>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <div className='flex items-center gap-3'>
                <CustomAvatar variant='rounded' color={item.color} className='shadow-xs'>
                  <i className={item.icon}></i>
                </CustomAvatar>
                <div>
                  <Typography>{item.title}</Typography>
                  <Typography variant='h5'>{item.stats}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Transactions
