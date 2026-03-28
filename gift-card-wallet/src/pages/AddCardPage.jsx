import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCards } from '../hooks/useCards'
import { useCardScanner } from '../hooks/useCardScanner'
import { CARD_TYPES } from '../data/cardTypes'
import AppBar from '../components/layout/AppBar'

export default function AddCardPage() {
  const navigate = useNavigate()
  const { addCard } = useCards()
  const { scan, scanning, error: scanError } = useCardScanner()
  const fileInputRef = useRef(null)

  const [assetType, setAssetType] = useState('gift_card')
  const [cardNumber, setCardNumber] = useState('')
  const [securityPin, setSecurityPin] = useState('')
  const [balance, setBalance] = useState('')
  const [cardType, setCardType] = useState('buyme')
  const [previewUrl, setPreviewUrl] = useState(null)

  async function handleFileCapture(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))

    const result = await scan(file)
    if (result) {
      if (result.cardNumber) setCardNumber(result.cardNumber)
      if (result.securityPin) setSecurityPin(result.securityPin)
      if (result.balance) setBalance(result.balance)
      if (result.cardType) setCardType(result.cardType)
    }

    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!cardNumber.trim()) return
    addCard({
      type: assetType,
      cardType,
      cardNumber: cardNumber.replace(/\s/g, ''),
      securityPin,
      balance: balance || '0',
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-surface">
      <AppBar title="Vault" showBack />

      <main className="pt-24 pb-40 px-6">
        {/* Toggle */}
        <section className="mb-10">
          <div className="flex justify-center mb-8">
            <div className="bg-surface-container-high p-1 rounded-full flex w-full max-w-[280px] shadow-inner">
              <button
                type="button"
                onClick={() => setAssetType('gift_card')}
                className={`flex-1 py-2.5 rounded-full text-xs font-headline font-bold tracking-tight transition-all ${
                  assetType === 'gift_card'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Gift Card
              </button>
              <button
                type="button"
                onClick={() => setAssetType('store_credit')}
                className={`flex-1 py-2.5 rounded-full text-xs font-headline font-bold tracking-tight transition-all ${
                  assetType === 'store_credit'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Store Credit
              </button>
            </div>
          </div>

          <h2 className="font-headline text-[1.75rem] font-extrabold tracking-tighter text-primary leading-tight mb-2">
            New Card
          </h2>
          <p className="text-on-surface-variant text-sm font-medium">
            Add a digital asset to your secure vault.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Scan Area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileCapture}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            className="relative w-full group cursor-pointer overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(26,28,29,0.06)] h-48 flex flex-col items-center justify-center transition-all hover:bg-surface-container active:scale-[0.98] disabled:opacity-70"
          >
            {scanning && (
              <div className="absolute inset-0 bg-surface/80 flex flex-col items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs font-headline font-bold text-primary">Reading card...</span>
              </div>
            )}
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Scanned card" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                <div className="relative z-[1] flex flex-col items-center pointer-events-none">
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">refresh</span>
                  <span className="font-headline font-bold text-sm tracking-tight text-primary">
                    Tap to Re-scan
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-primary to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4 transition-transform group-hover:scale-110 pointer-events-none">
                  <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                </div>
                <span className="font-headline font-bold text-sm tracking-tight text-primary pointer-events-none">
                  Scan Card
                </span>
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1 pointer-events-none">
                  Auto-fill from photo
                </span>
              </>
            )}
          </button>
          {scanError && (
            <p className="text-xs text-error text-center mt-2">{scanError}</p>
          )}

          {/* Manual Inputs */}
          <div className="space-y-6">
            {/* Card Number */}
            <div className="space-y-2">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full h-14 bg-surface-container-high border-none rounded-2xl px-6 font-headline font-semibold text-primary placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                </div>
              </div>
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={securityPin}
                  onChange={e => setSecurityPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-14 bg-surface-container-high border-none rounded-2xl px-6 font-headline font-semibold text-primary placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Balance
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={balance}
                  onChange={e => setBalance(e.target.value)}
                  placeholder="$0.00"
                  className="w-full h-14 bg-surface-container-high border-none rounded-2xl px-6 font-headline font-semibold text-primary placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
              </div>
            </div>

            {/* Card Type Selection */}
            <div className="space-y-3">
              <label className="font-label text-[0.75rem] font-bold tracking-widest text-on-surface-variant uppercase ml-1">
                Card Type
              </label>
              <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar -mx-1 px-1">
                {CARD_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setCardType(type.id)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all ${
                      cardType === type.id
                        ? 'bg-primary shadow-lg scale-[1.02]'
                        : 'bg-surface-container-high opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-2xl mb-1"
                      style={{
                        color: cardType === type.id ? '#ffffff' : type.color,
                      }}
                    >
                      {type.icon}
                    </span>
                    <span
                      className={`text-[10px] font-headline font-bold tracking-tight ${
                        cardType === type.id ? 'text-white' : 'text-on-surface-variant'
                      }`}
                    >
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-16 bg-gradient-to-tr from-primary to-primary-container text-on-primary-container rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Add Card
              <span className="material-symbols-outlined filled">add_circle</span>
            </button>
            <p className="text-center mt-6 text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
              Secure 256-bit Encryption
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
