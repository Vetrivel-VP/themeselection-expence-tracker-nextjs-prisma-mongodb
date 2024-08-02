// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports

import Award from './_components/award'
import Transactions from './_components/transactions'
import WeeklyOverview from '@views/dashboard/WeeklyOverview'
import TotalEarning from '@views/dashboard/TotalEarning'
import LineChart from '@views/dashboard/LineChart'
import DistributedColumnChart from '@views/dashboard/DistributedColumnChart'
import DepositWithdraw from '@views/dashboard/DepositWithdraw'
import SalesByCountries from '@views/dashboard/SalesByCountries'
import CardStatVertical from '@components/card-statistics/Vertical'
import Table from '@views/dashboard/Table'
import {
  getCurrentMonthBudgetsDetails,
  getComparisonMetrics,
  getWeeklyExpenses,
  formatNumber,
  getTopExpenses
} from '../../../actions/analytics'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/libs/db'

const DashboardAnalytics = async () => {
  const user = await currentUser()
  const { userId } = auth()

  if (!userId) {
    redirect('/')
  }

  const expences = await db.expences.findMany({
    where: { userId },
    include: { budget: true },
    orderBy: { createdAt: 'desc' }
  })

  const budgets = await db.budgets.findMany({
    where: { userId },
    include: { expences: true },
    orderBy: { createdAt: 'desc' }
  })

  const award_savingsOverBugets = await getCurrentMonthBudgetsDetails()
  const trans_cmp_curr_prev_month = await getComparisonMetrics()
  const weeklyExpences = await getWeeklyExpenses(userId)
  const topExpences = await getTopExpenses(userId)

  return (
    <Grid container spacing={6}>
      {/* savings overview */}

      <Grid item xs={12} md={4}>
        <Award {...award_savingsOverBugets} name={user?.firstName || ''} />
      </Grid>

      {/* Last Month Tota Expences */}
      <Grid item xs={12} sm={4}>
        <CardStatVertical
          title={trans_cmp_curr_prev_month?.previousMonth.monthName}
          stats={`$${trans_cmp_curr_prev_month?.previousMonth.savings}`}
          avatarIcon='ri-pie-chart-2-fill'
          avatarColor='secondary'
          subtitle='Monthly Profit'
          trendNumber={`${trans_cmp_curr_prev_month?.previousMonth.percentageUsed}`}
          trend='positive'
        />
      </Grid>

      {/* Current month total expences */}
      <Grid item xs={12} sm={4}>
        <CardStatVertical
          title={trans_cmp_curr_prev_month?.currentMonth.monthName}
          stats={`$${trans_cmp_curr_prev_month?.currentMonth.savings}`}
          avatarIcon='ri-pie-chart-2-fill'
          avatarColor='secondary'
          subtitle='Monthly Profit'
          trendNumber={`${trans_cmp_curr_prev_month?.currentMonth.percentageUsed}`}
          trend='positive'
        />
      </Grid>
      {/* transactions overview */}

      <Grid item xs={12}>
        <Transactions
          currentMonth={trans_cmp_curr_prev_month.currentMonth}
          previousMonth={trans_cmp_curr_prev_month.previousMonth}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
            <LineChart data={weeklyExpences.weeklyExpenses} totalExpences={weeklyExpences.totalExpenses} />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CardStatVertical
              title='Total Profit'
              stats='$25.6k'
              avatarIcon='ri-pie-chart-2-line'
              avatarColor='secondary'
              subtitle='Weekly Profit'
              trendNumber='42%'
              trend='positive'
            />
          </Grid> */}
          {expences && expences.length > 0 && (
            <Grid item xs={12} sm={12}>
              <CardStatVertical
                stats={formatNumber(parseFloat(expences[0].amount))}
                trend='negative'
                trendNumber=''
                title={expences[0]?.name}
                subtitle='New Expence'
                avatarColor='primary'
                avatarIcon='ri-file-word-2-line'
              />
            </Grid>
          )}
          {/* <Grid item xs={12} sm={6}>
            <DistributedColumnChart />
          </Grid> */}
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <WeeklyOverview
          data={weeklyExpences.weeklyExpenses}
          percentage={weeklyExpences.percentage}
          totalBudget={weeklyExpences.totalBudget}
          totalExpences={weeklyExpences.totalExpenses}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <TotalEarning budgets={budgets} percentageUsed={award_savingsOverBugets.percentageUsed} />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries expences={topExpences} />
      </Grid>
      {/* <Grid item xs={12} lg={8}>
        <DepositWithdraw />
      </Grid> */}
      {/* <Grid item xs={12}>
        <Table />
      </Grid> */}
    </Grid>
  )
}

export default DashboardAnalytics
