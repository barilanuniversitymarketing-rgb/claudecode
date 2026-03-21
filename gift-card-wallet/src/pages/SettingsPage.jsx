import { useCards } from '../hooks/useCards'

export default function SettingsPage() {
  const { cards } = useCards()

  function handleClearAll() {
    if (confirm('Delete all cards and data? This cannot be undone.')) {
      localStorage.removeItem('vault_cards')
      window.location.reload()
    }
  }

  return (
    <div>
      <h2 className="font-headline text-[1.75rem] font-extrabold tracking-tighter text-primary leading-tight mb-6">
        Settings
      </h2>

      <div className="space-y-3">
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">info</span>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-primary">About Vault</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Version 1.0.0 &middot; Gift Card Wallet MVP</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-primary">Stored Cards</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{cards.length} card{cards.length !== 1 ? 's' : ''} in your vault</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">shield</span>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-primary">Data Storage</p>
              <p className="text-xs text-on-surface-variant mt-0.5">All data stored locally on your device</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearAll}
          className="w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-left"
        >
          <div className="p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-error">delete_forever</span>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-error">Clear All Data</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Remove all cards and activity history</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
          </div>
        </button>
      </div>
    </div>
  )
}
