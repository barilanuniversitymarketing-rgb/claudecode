import { useLocalStorage } from './useLocalStorage'
import { generateId } from '../utils/generateId'

export function useCards() {
  const [cards, setCards] = useLocalStorage('vault_cards', [])

  function addCard({ type, cardType, cardNumber, securityPin, balance }) {
    const card = {
      id: generateId(),
      type: type || 'gift_card',
      cardType: cardType || 'generic',
      cardNumber,
      securityPin,
      balance: parseFloat(balance) || 0,
      initialBalance: parseFloat(balance) || 0,
      createdAt: new Date().toISOString(),
      transactions: [],
    }
    setCards(prev => [card, ...prev])
    return card
  }

  function getCard(id) {
    return cards.find(c => c.id === id)
  }

  function updateCard(id, updates) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  function deleteCard(id) {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function addTransaction(cardId, amount, note) {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) return c
      const transaction = {
        id: generateId(),
        amount: -Math.abs(parseFloat(amount)),
        note: note || 'Used at checkout',
        date: new Date().toISOString(),
      }
      return {
        ...c,
        balance: Math.max(0, c.balance + transaction.amount),
        transactions: [transaction, ...c.transactions],
      }
    }))
  }

  return { cards, addCard, getCard, updateCard, deleteCard, addTransaction }
}
