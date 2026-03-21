import { useNavigate } from 'react-router-dom'

export default function AppBar({ title = 'Vault', showBack = false }) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity"
          >
            arrow_back
          </button>
        )}
        <h1 className="font-headline font-bold tracking-tight text-xl text-primary">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
        </div>
      </div>
    </header>
  )
}
