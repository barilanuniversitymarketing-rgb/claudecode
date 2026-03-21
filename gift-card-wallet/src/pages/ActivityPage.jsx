import { useCards } from '../hooks/useCards'
import { getCardType } from '../data/cardTypes'
import { formatCurrency } from '../utils/formatCurrency'

export default function ActivityPage() {
  const { cards } = useCards()

  const allTransactions = cards
    .flatMap(card =>
      card.transactions.map(tx => ({
        ...tx,
        cardName: getCardType(card.cardType).name,
        cardIcon: getCardType(card.cardType).icon,
        cardColor: getCardType(card.cardType).color,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (allTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant">
            receipt_long
          </span>
        </div>
        <h2 className="font-headline font-bold text-lg text-primary mb-2">No activity yet</h2>
        <p className="text-sm text-on-surface-variant max-w-[220px]">
          Your card usage history will appear here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-headline text-[1.75rem] font-extrabold tracking-tighter text-primary leading-tight mb-6">
        Activity
      </h2>
      <div className="space-y-2">
        {allTransactions.map(tx => (
          <div
            key={tx.id}
            className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: tx.cardColor + '18' }}
            >
              <span className="material-symbols-outlined text-lg" style={{ color: tx.cardColor }}>
                {tx.cardIcon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{tx.note}</p>
              <p className="text-xs text-on-surface-variant">
                {tx.cardName} &middot; {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <p className="font-headline font-bold text-sm text-error shrink-0">
              {formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
