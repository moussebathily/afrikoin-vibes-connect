import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'
import { TopBar } from './TopBar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}