'use client'

import React from 'react'
import { Card, Grid } from '@mui/material'
import type { Budgets, Expences } from '@prisma/client'

import { BudgetCardItem } from '@/app/(dashboard)/budgets/_components/budget-card-item'
import { AddExpence } from './add-expence'

interface PageClientProps {
  budget: (Budgets & { expences: Expences[] }) | null
}

export const PageClient = ({ budget }: PageClientProps) => {
  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={6}>
          {budget ? (
            <BudgetCardItem budget={budget} />
          ) : (
            <Card className='p-2'>
              <div className='w-full h-32 rounded-md bg-gray-200 animate-pulse'></div>
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <AddExpence />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
