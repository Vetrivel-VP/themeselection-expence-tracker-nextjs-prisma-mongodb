'use client'
import { Breadcrumbs, Typography } from '@mui/material'
import { Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface CustomBreadCrumbProps {
  breadCrumbPage: string
  breadCrumbItem?: { link: string; label: string }[]
}

export const CustomBreadCrumb = ({ breadCrumbItem, breadCrumbPage }: CustomBreadCrumbProps) => {
  return (
    <Breadcrumbs aria-label='breadcrumbs' separator={'›'}>
      <Link color='primary' href='/' className='flex items-center text-purple-500'>
        <Home className='w-4 h-4 mr-2 p-0' />
        Analytics
      </Link>
      {breadCrumbItem?.map(item => (
        <Link key={item.link} color='neutral' href={item.link}>
          {item.label}
        </Link>
      ))}
      <Typography>{breadCrumbPage}</Typography>
    </Breadcrumbs>
  )
}
