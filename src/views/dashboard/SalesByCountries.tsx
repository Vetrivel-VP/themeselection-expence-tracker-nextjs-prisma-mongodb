// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import { Budgets, Expences } from '@prisma/client'
import { DollarSign } from 'lucide-react'
import { formatNumber } from '../../../actions/analytics'
import { format } from 'date-fns'

type DataType = {
  avatarLabel: string
  avatarColor?: ThemeColor
  title: string
  subtitle: string
  sales: string
  trend: 'up' | 'down'
  trendPercentage: string
}

// Vars
const data: DataType[] = [
  {
    avatarLabel: 'US',
    avatarColor: 'success',
    title: '$8,656k',
    subtitle: 'United states of america',
    sales: '894k',
    trend: 'up',
    trendPercentage: '25.8%'
  },
  {
    avatarLabel: 'UK',
    avatarColor: 'error',
    title: '$2,415k',
    subtitle: 'United kingdom',
    sales: '645k',
    trend: 'down',
    trendPercentage: '6.2%'
  },
  {
    avatarLabel: 'IN',
    avatarColor: 'warning',
    title: '$865k',
    subtitle: 'India',
    sales: '148k',
    trend: 'up',
    trendPercentage: '12.4%'
  },
  {
    avatarLabel: 'JA',
    avatarColor: 'secondary',
    title: '$745k',
    subtitle: 'Japan',
    sales: '86k',
    trend: 'down',
    trendPercentage: '11.9%'
  },
  {
    avatarLabel: 'KO',
    avatarColor: 'error',
    title: '$45k',
    subtitle: 'Korea',
    sales: '42k',
    trend: 'up',
    trendPercentage: '16.2%'
  }
]

interface PageClientProps {
  expences: Expences[] | []
}

const SalesByCountries = ({ expences }: PageClientProps) => {
  return (
    <Card>
      <CardHeader title='Sales by Countries' />
      <CardContent className='flex flex-col gap-[0.875rem]'>
        {expences.map((item, index) => (
          <div key={index} className='flex items-center gap-4'>
            <CustomAvatar skin='light' color={'primary'}>
              <DollarSign />
            </CustomAvatar>
            <div className='flex items-center justify-between is-full flex-wrap gap-x-4 gap-y-2'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.name}
                  </Typography>
                  {/* <div className={'flex items-center gap-1'}>
                    <i
                      className={classnames(
                        item.trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line',
                        item.trend === 'up' ? 'text-success' : 'text-error'
                      )}
                    ></i>
                    <Typography color={item.trend === 'up' ? 'success.main' : 'error.main'}>
                      {item.trendPercentage}
                    </Typography>
                  </div> */}
                </div>
                <Typography variant='body2' color='text.disabled'>
                  {format(new Date(item.createdAt), 'MMMM dd, yyyy')}
                </Typography>
              </div>
              <div className='flex flex-col gap-1'>
                <Typography variant='body2' color='text.primary' className='font-medium'>
                  ${formatNumber(parseFloat(item.amount))}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SalesByCountries
