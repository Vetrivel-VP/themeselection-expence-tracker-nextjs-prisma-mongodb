import { db } from '@/libs/db'
import { startOfMonth, endOfMonth, subMonths, format, endOfWeek, startOfWeek } from 'date-fns'

// Function to format numbers as 'K' or 'M'
export const formatNumber = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} M` // Millions
  } else if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)} K` // Thousands
  } else {
    return amount.toFixed(2) // Less than 1000
  }
}

export const getCurrentMonthBudgetsDetails = async () => {
  // Determine the start and end dates of the current month
  const now = new Date()
  const startDate = startOfMonth(now)
  const endDate = endOfMonth(now)

  // Fetch all budgets with their expenses
  const budgets = await db.budgets.findMany({
    include: { expences: true },
    where: {
      expences: {
        some: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    }
  })

  // Calculate total budget amount and total expenses for the current month
  const totalBudgetAmount = budgets.reduce((total, budget) => total + parseFloat(budget.amount), 0)
  const totalExpenses = budgets.reduce(
    (acc, budget) =>
      acc +
      budget.expences.reduce((expAcc, expense) => {
        const expenseDate = new Date(expense.createdAt)
        // Only include expenses within the current month
        return expenseDate >= startDate && expenseDate <= endDate ? expAcc + parseFloat(expense.amount) : expAcc
      }, 0),
    0
  )

  const savings = totalBudgetAmount - totalExpenses
  const percentageUsed = totalBudgetAmount > 0 ? (totalExpenses / totalBudgetAmount) * 100 : 0

  return {
    totalBudgetAmount: formatNumber(totalBudgetAmount), // Apply formatting here
    totalExpenses: formatNumber(totalExpenses),
    savings: formatNumber(savings), // Apply formatting here
    percentageUsed: `${percentageUsed.toFixed(2)}%` // Add percentage sign
  }
}
// Function to get the metrics for a given month
const getMonthlyMetrics = async (startDate: Date, endDate: Date) => {
  const budgets = await db.budgets.findMany({
    include: { expences: true },
    where: {
      expences: {
        some: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    }
  })

  // Calculate total budget amount and total expenses
  const totalBudgetAmount = budgets.reduce((acc, budget) => acc + parseFloat(budget.amount), 0)
  const totalExpenses = budgets.reduce(
    (acc, budget) => acc + budget.expences.reduce((expAcc, expense) => expAcc + parseFloat(expense.amount), 0),
    0
  )

  const savings = totalBudgetAmount - totalExpenses
  const percentageUsed = totalBudgetAmount > 0 ? (totalExpenses / totalBudgetAmount) * 100 : 0

  return {
    totalBudgetAmount,
    totalExpenses,
    savings,
    percentageUsed
  }
}

// Function to get current and previous month metrics
export const getComparisonMetrics = async () => {
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)
  const startOfPreviousMonth = startOfMonth(subMonths(now, 1))
  const endOfPreviousMonth = endOfMonth(subMonths(now, 1))

  const currentMonthMetrics = await getMonthlyMetrics(startOfCurrentMonth, endOfCurrentMonth)
  const previousMonthMetrics = await getMonthlyMetrics(startOfPreviousMonth, endOfPreviousMonth)

  return {
    currentMonth: {
      monthName: format(startOfCurrentMonth, 'MMMM yyyy'),
      totalBudgetAmount: formatNumber(currentMonthMetrics.totalBudgetAmount),
      totalExpenses: formatNumber(currentMonthMetrics.totalExpenses),
      savings: formatNumber(currentMonthMetrics.savings),
      percentageUsed: `${currentMonthMetrics.percentageUsed.toFixed(2)}%`
    },
    previousMonth: {
      monthName: format(startOfPreviousMonth, 'MMMM yyyy'),
      totalBudgetAmount: formatNumber(previousMonthMetrics.totalBudgetAmount),
      totalExpenses: formatNumber(previousMonthMetrics.totalExpenses),
      savings: formatNumber(previousMonthMetrics.savings),
      percentageUsed: `${previousMonthMetrics.percentageUsed.toFixed(2)}%`
    }
  }
}

export const getWeeklyExpenses = async (userId: string) => {
  // Define the start date as today
  const startDate = new Date()

  // Calculate the end date as the end of the week from the start date
  const endDate = endOfWeek(startDate)

  // Query expenses within the given date range
  const expenses = await db.expences.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfWeek(startDate), // Start of the week
        lte: endDate // End of the week
      }
    }
  })

  // Initialize an array for each day of the week
  const weeklyExpenses = Array(7).fill(0)

  expenses.forEach(expense => {
    const date = new Date(expense.createdAt)
    const dayOfWeek = date.getDay() // Get day of the week (0 for Sunday, 6 for Saturday)
    weeklyExpenses[dayOfWeek] += parseFloat(expense.amount) // Aggregate expenses by day
  })

  // Fetch total budget for the user
  const budgets = await db.budgets.findMany({
    where: {
      userId
    },
    select: {
      amount: true
    }
  })

  // Calculate the total budget amount
  const totalBudget = budgets.reduce((total, budget) => total + parseFloat(budget.amount), 0)

  // Calculate total expenses for the week
  const totalExpenses = weeklyExpenses.reduce((total, dailyExpense) => total + dailyExpense, 0)

  // Calculate the percentage of expenses relative to the total budget
  const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

  return {
    weeklyExpenses,
    totalExpenses: formatNumber(totalExpenses),
    totalBudget: formatNumber(totalBudget),
    percentage: `${percentage.toFixed(2)}%`
  }
}

export const getTopExpenses = async (userId: string) => {
  // Determine the start and end dates of the current month
  const now = new Date()
  const startDate = startOfMonth(now)
  const endDate = endOfMonth(now)

  // Query expenses for the current month greater than $100
  const expenses = await db.expences.findMany({
    where: {
      userId,
      amount: {
        gte: '100' // Ensure amount is in the right format for comparison
      },
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      amount: 'desc' // Sort expenses in descending order by amount
    }
  })

  return expenses.slice(0, 5)
}
