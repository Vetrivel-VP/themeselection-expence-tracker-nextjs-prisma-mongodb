import Table, { ExpenceTableColumns } from '@/components/expences-table'
import { Grid } from '@mui/material'
import { Budgets, Expences } from '@prisma/client'
import { format } from 'date-fns'
import React from 'react'

interface PageClientProps {
  expences: (Expences & { budget: Budgets })[] | null
}

export const PageClient = ({ expences }: PageClientProps) => {
  const formattedExpencesColumns: ExpenceTableColumns[] | undefined = expences?.map(expence => ({
    id: expence.id,
    budgetIcon: expence.budget.icon,
    name: expence.budget.name,
    expenceName: expence.name,
    overallBudget: `${expence.budget.amount}`,
    amount: expence.amount,
    date: expence.createdAt ? format(new Date(expence.createdAt), 'MMMM do, yyyy') : 'N/A'
  }))
  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {formattedExpencesColumns && formattedExpencesColumns?.length > 0 && (
          <Grid item xs={12} md={12} className='my-8'>
            <Table rowsData={formattedExpencesColumns} isBudgetDataInclude={true} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  )
}
