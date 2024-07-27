'use client'

import React, { useState } from 'react'
import { Card, LinearProgress, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import { Loader, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import type { Budgets, Expences } from '@prisma/client'

interface BudgetCardItemProps {
  budget: Budgets & { expences: Expences[] }
}

export const BudgetCardItem = ({ budget }: BudgetCardItemProps) => {
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

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateBudgetAmount = async () => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/budgets/${budget.id}`, { amount: '50' })
      toast.success('Budget Updated')
      router.refresh()
    } catch (error) {
      toast.error((error as Error)?.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='p-2 space-y-4' variant='outlined'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center bg-purple-200/50 rounded-full text-3xl min-w-12 min-h-12'>
            {budget.icon}
          </div>
          <Link href={`/budgets/${budget.id}`}>
            <div>
              <Typography variant='h6' noWrap>
                {budget.name}
              </Typography>
              <Typography variant='body1' noWrap>
                {budget.expences.length} items
              </Typography>
            </div>
          </Link>
        </div>

        <div className='flex items-center gap-2'>
          {isLoading ? (
            <Loader className='w-5 h-5 animate-spin' />
          ) : (
            <Tooltip title='+ 50$'>
              <div onClick={updateBudgetAmount}>
                <Card
                  variant='outlined'
                  className='rounded-md cursor-pointer px-1 py-[1px] flex items-center justify-center bg-transparent border border-emerald-300'
                >
                  <Plus className='w-3 h-3 mr-1' /> <Typography className='text-xs'>50</Typography>
                </Card>
              </div>
            </Tooltip>
          )}
          <Typography variant='h6' className='font-bold'>
            {budget.amount} $
          </Typography>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Typography variant='body2'>Spent: {totalExpenses.toFixed(2)} $</Typography>
          <Typography variant='body2'>Remaining: {remainingAmount.toFixed(2)} $</Typography>
        </div>
        <LinearProgress variant='determinate' value={progress} />
      </div>
    </Card>
  )
}
