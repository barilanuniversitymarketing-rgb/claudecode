import { Outlet } from 'react-router-dom'
import AppBar from './AppBar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-surface">
      <AppBar />
      <main className="pt-20 pb-28 px-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
