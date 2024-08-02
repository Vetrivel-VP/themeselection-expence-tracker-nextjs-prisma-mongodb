'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import { BadgeDollarSign, DollarSign, Trash, Trash2 } from 'lucide-react'
import { Button } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export type ExpenceTableColumns = {
  id: string
  budgetIcon?: string
  name?: string
  overallBudget?: string
  expenceName: string
  amount: string
  date: string
}

interface ExpenceTable {
  rowsData: ExpenceTableColumns[]
  isBudgetDataInclude?: boolean
}

const Table = ({ rowsData, isBudgetDataInclude }: ExpenceTable) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const response = await axios.delete(`/api/expences/${id}`)
    toast.success('Expence Removed')
    router.refresh()
    try {
    } catch (error) {
      toast.error((error as Error)?.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              {isBudgetDataInclude && <th>Budget</th>}
              <th>Expence</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((row, index) => (
              <tr key={index}>
                {isBudgetDataInclude && (
                  <td className='!plb-1'>
                    <div className='flex items-center gap-3'>
                      <Typography variant='h3'>{row.budgetIcon}</Typography>
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                          {row.name}
                        </Typography>
                        <Typography variant='body2' className='flex items-center gap-1'>
                          <DollarSign className='w-3 h-3' />
                          {row.overallBudget}
                        </Typography>
                      </div>
                    </div>
                  </td>
                )}
                <td className='!plb-1'>
                  <Typography>{row.expenceName}</Typography>
                </td>
                <td className='!plb-1'>
                  <div className='flex gap-2 items-center '>
                    <DollarSign className='w-4 h-4' />
                    <Typography color='text.primary'>{row.amount}</Typography>
                  </div>
                </td>
                <td className='!pb-1'>
                  <Typography color='text.primary'>{row.date}</Typography>
                </td>
                <td className='!pb-1'>
                  <Button className='text-red-500' disabled={isDeleting} onClick={() => handleDelete(row.id)}>
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Table
