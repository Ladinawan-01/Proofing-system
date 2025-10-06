'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  FileText,
  Plus,
  Archive,
  Home,
  LogOut,
  
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLogo } from '@/contexts/LogoContext'

interface AdminHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export default function AdminHeader({ title, description, icon }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logoUrl } = useLogo()
  
  // Since we're in admin area, user is admin
  const isAdmin = true

  const handleLogout = async () => {
    try {
      document.cookie = 'admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/projects', label: 'All Projects', icon: FileText },
    { path: '/admin/new-project', label: 'New Project', icon: Plus },
    { path: '/admin/archives', label: 'Archives', icon: Archive },
  ]

  return (
    <header className="border-b border-neutral-800 bg-black">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard">
          <Image
            src={logoUrl}
            alt="Newstate Branding Co."
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin/dashboard" className="text-neutral-400 hover:text-brand-yellow transition-colors">
            DASHBOARD
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/admin/new-project" className="text-white hover:text-brand-yellow transition-colors">
            ADD NEW PROJECT
          </Link>
          <span className="text-neutral-600">|</span>
          <Link href="/admin/archives" className="text-neutral-400 hover:text-brand-yellow transition-colors">
            PROJECT ARCHIVES
          </Link>
          <span className="text-neutral-600">|</span>
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-brand-yellow transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              LOGOUT
            </button>
          )}
        </nav>
      </div>
    </div>
  </header>
  )
}
