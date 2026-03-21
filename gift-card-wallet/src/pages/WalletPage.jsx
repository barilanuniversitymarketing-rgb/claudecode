import { useNavigate } from 'react-router-dom'
import { useCards } from '../hooks/useCards'
import { getCardType } from '../data/cardTypes'
import { formatCurrency } from '../utils/formatCurrency'

function CardListItem({ card }) {
  const navigate = useNavigate()
  const type = getCardType(card.cardType)
  const masked = card.cardNumber.length > 4
    ? '•••• ' + card.cardNumber.slice(-4)
    : card.cardNumber

  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className="w-full bg-surface-container-lowest rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] text-left"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: type.color + '18' }}
      >
        <span className="material-symbols-outlined" style={{ color: type.color }}>
          {type.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-sm text-primary truncate">{type.name}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{masked}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-headline font-bold text-base text-primary">
          {formatCurrency(card.balance)}
        </p>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
          {card.type === 'store_credit' ? 'Credit' : 'Balance'}
        </p>
      </div>
    </button>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">
          account_balance_wallet
        </span>
      </div>
      <h2 className="font-headline font-bold text-xl text-primary mb-2">Your vault is empty</h2>
      <p className="text-sm text-on-surface-variant mb-8 max-w-[240px]">
        Add your first gift card and never let a balance go to waste.
      </p>
      <button
        onClick={() => navigate('/add')}
        className="bg-primary text-on-primary-container rounded-full px-8 py-3 font-headline font-bold text-sm shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
      >
        Add Your First Card
      </button>
    </div>
  )
}

export default function WalletPage() {
  const { cards } = useCards()
  const navigate = useNavigate()

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0)

  if (cards.length === 0) return <EmptyState />

  return (
    <div>
      {/* Total Balance */}
      <div className="mb-8 text-center">
        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium mb-1">
          Total Balance
        </p>
        <p className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* Card List */}
      <div className="space-y-3">
        {cards.map(card => (
          <CardListItem key={card.id} card={card} />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary-container rounded-full shadow-xl shadow-primary/20 flex items-center justify-center active:scale-[0.95] transition-all z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  )
}
