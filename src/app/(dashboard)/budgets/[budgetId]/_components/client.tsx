'use client'

import React from 'react'
import { Card, Grid } from '@mui/material'
import type { Budgets, Expences } from '@prisma/client'
import { format } from 'date-fns'

import { BudgetCardItem } from '@/app/(dashboard)/budgets/_components/budget-card-item'
import { AddExpence } from './add-expence'
import Table, { ExpenceTableColumns } from '@/components/expences-table'

interface PageClientProps {
  budget: (Budgets & { expences: Expences[] }) | null
}

export const PageClient = ({ budget }: PageClientProps) => {
  const formattedExpencesColumns: ExpenceTableColumns[] | undefined = budget?.expences.map(expence => ({
    id: expence.id,
    expenceName: expence.name,
    amount: expence.amount,
    isBudgetDataInclude: false,
    date: expence.createdAt ? format(new Date(expence.createdAt), 'MMMM do, yyyy') : 'N/A'
  }))

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

        {formattedExpencesColumns && formattedExpencesColumns?.length > 0 && (
          <Grid item xs={12} md={12} className='my-8'>
            <Table rowsData={formattedExpencesColumns} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  )
}
