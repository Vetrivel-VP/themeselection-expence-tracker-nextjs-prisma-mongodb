// Next Imports
import Link from 'next/link'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { UserButton } from '@clerk/nextjs'

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-2 sm:gap-4'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center space-x-4'>
        {/* <Link
          className='flex mie-2'
          href={`https://github.com/themeselection/${process.env.NEXT_PUBLIC_REPO_NAME}`}
          target='_blank'
        >
          <img
            height={24}
            alt='GitHub Repo stars'
            src={`https://img.shields.io/github/stars/themeselection/${process.env.NEXT_PUBLIC_REPO_NAME}`}
          />
        </Link> */}
        <ModeDropdown />
        {/* <IconButton className='text-textPrimary'>
          <i className='ri-notification-2-line' />
        </IconButton> */}
        {/* <UserDropdown /> */}
        <UserButton />
      </div>
    </div>
  )
}

export default NavbarContent
