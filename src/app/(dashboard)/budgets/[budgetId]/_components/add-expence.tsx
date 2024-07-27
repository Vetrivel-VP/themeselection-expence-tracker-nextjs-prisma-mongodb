'use client'

import { Box, Button, Card, Divider, TextField, Typography } from '@mui/material'
import React from 'react'

import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Budget title cannot be empty' }),
  amount: z.string().refine(value => parseFloat(value) > 0, { message: 'Amount must be greater than 0' })
})

export const AddExpence = () => {
  const params = useParams()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: ''
    }
  })

  const { isSubmitting, isValid, errors } = form.formState
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/budgets/${params.budgetId}`, values)
      toast.success('Expense Created')
      form.reset()
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Check if the error response status is 400 and message is 'Not enough amount in the budget'
        if (error.response.status === 400 && error.response.data === 'Not enough amount in the budget') {
          toast.error('Not enough amount in the budget')
        } else {
          // Display any other error messages from the server
          toast.error(error.response.data || 'Something went wrong')
        }
      } else {
        // Display a generic error message for non-Axios errors
        toast.error((error as Error)?.message || 'Something went wrong')
      }
    }
  }

  return (
    <Card variant='outlined' className=' p-3'>
      <Typography variant='h5'>Add New Expence </Typography>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Controller
            name='name'
            control={form.control}
            render={({ field }) => (
              <TextField
                error={!!errors.name}
                className='flex-1'
                id='standard-basic'
                label={!!errors.name ? errors?.name.message : 'Expence Name'}
                variant='outlined'
                {...field}
              />
            )}
          />

          <Controller
            name='amount'
            control={form.control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount}
                className='flex-1'
                id='standard-amount'
                label={!!errors.amount ? errors?.amount.message : 'Amount : eg:- 1000$'}
                variant='outlined'
                {...field}
              />
            )}
          />

          {/* action button */}

          <div className='flex items-center justify-end w-full gap-3'>
            <Button type='submit' size='large' variant='contained' disabled={isSubmitting || !isValid}>
              Add
            </Button>
          </div>
        </Box>
      </form>
    </Card>
  )
}
