'use client'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

import { X } from 'lucide-react'
import { useState } from 'react'

interface ModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export const Modal = ({ title, description, isOpen, onClose, children }: ModalProps) => {
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm')
  return (
    <BootstrapDialog
      fullWidth={true}
      maxWidth={maxWidth}
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {title}
      </DialogTitle>

      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
      >
        <X className='w-4 h-4' />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
    </BootstrapDialog>
  )
}
