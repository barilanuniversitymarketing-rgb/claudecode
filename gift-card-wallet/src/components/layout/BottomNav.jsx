import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: 'account_balance_wallet', label: 'Wallet' },
  { to: '/activity', icon: 'receipt_long', label: 'Activity' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-8 pb-6 pt-4 bg-white/80 backdrop-blur-md rounded-t-[2rem] shadow-[0_-20px_40px_rgba(26,28,29,0.06)]">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-2 transition-colors ${
              isActive
                ? 'text-primary bg-surface-container-low rounded-full'
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                {icon}
              </span>
              <span className="font-headline text-[10px] font-medium tracking-widest uppercase mt-1">
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
