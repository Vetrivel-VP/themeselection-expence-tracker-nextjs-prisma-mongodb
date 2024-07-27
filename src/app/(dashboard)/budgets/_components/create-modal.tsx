'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Divider, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { Modal } from '@/components/modal'

interface CreateBudgetModalProps {
  isOpen: boolean
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Budget title cannot be empty' }),
  icon: z.string().min(1, { message: 'Please select an emoji' }),
  amount: z.string().refine(value => parseFloat(value) > 0, { message: 'Amount must be greater than 0' })
})

export const CreateBudgetModal = ({ isOpen, onClose }: CreateBudgetModalProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '😀',
      amount: ''
    }
  })

  const { isSubmitting, isValid, errors } = form.formState
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/budgets', values)
      toast.success('Job Created')
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error((error as Error)?.message)
    } finally {
      onClose()
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Modal title='Create Budget' description='This action cannot be undone' isOpen={isOpen} onClose={onClose}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className='w-full flex items-center gap-2 py-3'>
            <Controller
              name='name'
              control={form.control}
              render={({ field }) => (
                <TextField
                  error={!!errors.name}
                  className='flex-1'
                  id='standard-basic'
                  label={!!errors.name ? errors?.name.message : 'Budget Title'}
                  variant='outlined'
                  {...field}
                />
              )}
            />

            <Controller
              name='icon'
              control={form.control}
              render={({ field }) => (
                <Button
                  variant='outlined'
                  className='py-4 border-gray-300'
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  {...field}
                >
                  {field.value}
                </Button>
              )}
            />
          </div>
          {openEmojiPicker && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'fixed', zIndex: 10, right: '5%', overflow: 'visible' }}>
                <EmojiPicker
                  onEmojiClick={e => {
                    form.setValue('icon', e.emoji)
                    setOpenEmojiPicker(false)
                  }}
                />
              </Box>
            </Box>
          )}

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
          <Divider className='mb-4' />
          <div className='flex items-center justify-end w-full gap-3'>
            <Button type='button' onClick={onClose} variant='outlined' size='large'>
              Cancel
            </Button>
            <Button type='submit' size='large' variant='contained' disabled={isSubmitting || !isValid}>
              Continue
            </Button>
          </div>
        </Box>
      </form>
    </Modal>
  )
}
