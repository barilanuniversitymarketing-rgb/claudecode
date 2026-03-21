import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCards } from '../hooks/useCards'
import { getCardType } from '../data/cardTypes'
import { formatCurrency } from '../utils/formatCurrency'
import JsBarcode from 'jsbarcode'
import AppBar from '../components/layout/AppBar'

function BarcodeDisplay({ value }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: true,
          background: 'transparent',
          lineColor: '#1a1c1d',
          margin: 10,
          fontSize: 14,
          font: 'Inter',
        })
      } catch {
        // Invalid barcode value
      }
    }
  }, [value])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-center overflow-hidden">
      <svg ref={svgRef} className="w-full" />
    </div>
  )
}

export default function CardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cards, addTransaction, deleteCard } = useCards()
  const card = cards.find(c => c.id === id)

  const [showUseModal, setShowUseModal] = useState(false)
  const [useAmount, setUseAmount] = useState('')
  const [useNote, setUseNote] = useState('')
  const [showPin, setShowPin] = useState(false)

  if (!card) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-surface">
        <AppBar title="Vault" showBack />
        <div className="pt-24 px-6 text-center">
          <p className="text-on-surface-variant">Card not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary font-headline font-bold text-sm"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    )
  }

  const type = getCardType(card.cardType)

  function handleUseBalance() {
    const amount = parseFloat(useAmount)
    if (!amount || amount <= 0) return
    addTransaction(card.id, amount, useNote || 'Used at checkout')
    setShowUseModal(false)
    setUseAmount('')
    setUseNote('')
  }

  function handleDelete() {
    if (confirm('Delete this card? This cannot be undone.')) {
      deleteCard(card.id)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-surface">
      <AppBar title={type.name} showBack />

      <main className="pt-24 pb-20 px-6 space-y-6">
        {/* Card Header */}
        <div className="bg-gradient-to-tr from-primary to-primary-container rounded-3xl p-6 text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl" style={{ color: type.color }}>
              {type.icon}
            </span>
            <span className="font-headline font-bold">{type.name}</span>
            <span className="ml-auto text-xs uppercase tracking-wider opacity-60">
              {card.type === 'store_credit' ? 'Store Credit' : 'Gift Card'}
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Balance</p>
          <p className="font-headline text-4xl font-extrabold tracking-tighter">
            {formatCurrency(card.balance)}
          </p>
          <p className="text-xs opacity-40 mt-1">
            Original: {formatCurrency(card.initialBalance)}
          </p>
        </div>

        {/* Barcode */}
        <BarcodeDisplay value={card.cardNumber} />

        {/* Card Details */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
              Card Number
            </span>
            <span className="font-headline font-semibold text-sm text-primary">
              {card.cardNumber}
            </span>
          </div>
          {card.securityPin && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
                PIN
              </span>
              <button
                onClick={() => setShowPin(!showPin)}
                className="font-headline font-semibold text-sm text-primary flex items-center gap-2"
              >
                {showPin ? card.securityPin : '••••'}
                <span className="material-symbols-outlined text-base text-on-surface-variant">
                  {showPin ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
              Added
            </span>
            <span className="font-headline font-semibold text-sm text-primary">
              {new Date(card.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowUseModal(true)}
            className="flex-1 h-14 bg-primary text-on-primary-container rounded-full font-headline font-bold text-sm shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            Use Balance
          </button>
          <button
            onClick={handleDelete}
            className="h-14 w-14 bg-surface-container-high rounded-full flex items-center justify-center text-error active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>

        {/* Transaction History */}
        {card.transactions.length > 0 && (
          <div>
            <h3 className="font-headline font-bold text-sm text-primary mb-3">History</h3>
            <div className="space-y-2">
              {card.transactions.map(tx => (
                <div
                  key={tx.id}
                  className="bg-surface-container-lowest rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">{tx.note}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-headline font-bold text-sm text-error">
                    {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Use Balance Modal */}
      {showUseModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUseModal(false)}
          />
          <div className="relative w-full max-w-md bg-surface rounded-t-3xl p-6 pb-10 space-y-5">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto" />
            <h3 className="font-headline font-bold text-xl text-primary">Use Balance</h3>
            <div className="space-y-2">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Amount
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={useAmount}
                onChange={e => setUseAmount(e.target.value)}
                placeholder="$0.00"
                autoFocus
                className="w-full h-14 bg-surface-container-high border-none rounded-2xl px-6 font-headline font-semibold text-primary placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={useNote}
                onChange={e => setUseNote(e.target.value)}
                placeholder="e.g. Used at store"
                className="w-full h-14 bg-surface-container-high border-none rounded-2xl px-6 font-headline font-semibold text-primary placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
              />
            </div>
            <button
              onClick={handleUseBalance}
              className="w-full h-14 bg-primary text-on-primary-container rounded-full font-headline font-bold text-sm shadow-lg active:scale-[0.98] transition-all"
            >
              Deduct {useAmount ? formatCurrency(parseFloat(useAmount) || 0) : '$0.00'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
