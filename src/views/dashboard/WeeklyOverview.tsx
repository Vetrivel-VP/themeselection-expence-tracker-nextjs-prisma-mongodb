'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionsMenu from '@core/components/option-menu'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

interface WeeklyOverviewProps {
  data: number[]
  percentage: string
  totalExpences: string
  totalBudget: string
}

const WeeklyOverview = ({ data, percentage, totalExpences, totalBudget }: WeeklyOverviewProps) => {
  // Hooks
  const theme = useTheme()
  const router = useRouter()

  // Vars
  const divider = 'var(--mui-palette-divider)'
  const disabled = 'var(--mui-palette-text-disabled)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '40%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: { show: false },
    grid: {
      xaxis: { lines: { show: false } },
      strokeDashArray: 7,
      padding: { left: -9, top: -20, bottom: 13 },
      borderColor: divider
    },
    dataLabels: { enabled: false },
    colors: [
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-customColors-trackBg)',
      'var(--mui-palette-customColors-trackBg)'
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: disabled, fontSize: theme.typography.body2.fontSize as string },
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }

  const handleRefresh = async () => {
    router.refresh()
    toast.success('Data Reloaded')
  }

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
        action={
          <OptionsMenu
            iconClassName='text-textPrimary'
            options={[{ text: 'Refresh', menuItemProps: { onClick: handleRefresh } }]}
          />
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <AppReactApexCharts
          type='bar'
          height={206}
          width='100%'
          series={[{ name: 'Sales', data: data }]}
          options={options}
        />
        <div className='flex items-center mbe-4 gap-4 '>
          <Typography variant='h4'>{percentage}</Typography>
          <Typography variant='body2'>
            This week, you have spent <strong>${totalExpences}</strong>, which is
            <strong> {percentage} </strong> of your total budget of
            <strong> ${totalBudget}</strong>. Keep up the great work or consider adjusting your spending!
          </Typography>
        </div>
        <Link href={'/expenses'}>
          <Button fullWidth variant='contained'>
            Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
