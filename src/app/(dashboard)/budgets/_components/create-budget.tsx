'use client'

import React, { useState } from 'react'
import { Button, Card } from '@mui/material'
import { Plus } from 'lucide-react'

import { CreateBudgetModal } from './create-modal'

export const CreateBudget = () => {
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <CreateBudgetModal isOpen={open} onClose={() => setOpen(false)} />
      <Card
        variant='outlined'
        className='border-dashed border-2 h-28 flex items-center justify-center'
        onClick={() => setOpen(true)}
      >
        <Button type='button' variant='text' className='flex-col gap-y-4 w-full h-full hover:bg-transparent'>
          <Plus className='w-5 h-5' />
          Create Your Budget
        </Button>
      </Card>
    </React.Fragment>
  )
}
