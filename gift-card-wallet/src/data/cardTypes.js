export const CARD_TYPES = [
  { id: 'buyme', name: 'BuyMe', icon: 'card_giftcard', color: '#FF6B35' },
  { id: 'tav-hazahav', name: 'Tav Hazahav', icon: 'stars', color: '#FFD700' },
  { id: 'amazon', name: 'Amazon', icon: 'shopping_cart', color: '#FF9900' },
  { id: 'starbucks', name: 'Starbucks', icon: 'coffee', color: '#00704A' },
  { id: 'apple', name: 'Apple', icon: 'phone_iphone', color: '#555555' },
  { id: 'google-play', name: 'Google Play', icon: 'play_arrow', color: '#34A853' },
  { id: 'visa', name: 'Visa', icon: 'credit_card', color: '#1A1F71' },
  { id: 'mastercard', name: 'Mastercard', icon: 'credit_card', color: '#EB001B' },
  { id: 'generic', name: 'Other', icon: 'redeem', color: '#777777' },
]

export function getCardType(id) {
  return CARD_TYPES.find(t => t.id === id) || CARD_TYPES[CARD_TYPES.length - 1]
}
