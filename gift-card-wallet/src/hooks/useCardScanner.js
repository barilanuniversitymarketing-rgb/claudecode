import { useState, useRef, useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import { CARD_TYPES } from '../data/cardTypes'

function extractCardNumber(text) {
  // Look for sequences of 8+ digits (with optional spaces/dashes)
  const patterns = text.match(/\b\d[\d\s\-]{6,18}\d\b/g)
  if (!patterns) return null

  // Strip non-digits, keep the longest match that's 8+ digits
  const candidates = patterns
    .map(p => p.replace(/[\s\-]/g, ''))
    .filter(p => p.length >= 8)
    .sort((a, b) => b.length - a.length)

  return candidates[0] || null
}

function extractPin(text) {
  // Look for PIN/security/code followed by digits
  const match = text.match(/(?:pin|security\s*code|code|cvv)[:\s#]*(\d{4,8})/i)
  return match ? match[1] : null
}

function extractBalance(text) {
  // Currency patterns: $XX.XX, ₪XX.XX, XX.XX with currency nearby
  const match = text.match(/(?:\$|₪|ILS|USD|NIS)?\s*(\d+[.,]\d{2})\b/)
  if (match) return match[1].replace(',', '.')

  // Also try "balance: XX" pattern
  const balMatch = text.match(/(?:balance|value|amount)[:\s]*(?:\$|₪)?\s*(\d+(?:[.,]\d{2})?)/i)
  if (balMatch) return balMatch[1].replace(',', '.')

  return null
}

function extractCardType(text) {
  const lower = text.toLowerCase()
  for (const type of CARD_TYPES) {
    if (type.id === 'generic') continue
    // Match brand name in OCR text
    if (lower.includes(type.name.toLowerCase())) {
      return type.id
    }
  }
  // Also try common aliases
  if (lower.includes('buy me')) return 'buyme'
  if (lower.includes('google play')) return 'google-play'
  if (lower.includes('tav hazahav') || lower.includes('golden tag')) return 'tav-hazahav'
  return null
}

export function useCardScanner() {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const workerRef = useRef(null)

  const scan = useCallback(async (imageFile) => {
    setScanning(true)
    setError(null)

    try {
      if (!workerRef.current) {
        const worker = await createWorker('eng+heb')
        workerRef.current = worker
      }

      const { data } = await workerRef.current.recognize(imageFile)
      const text = data.text

      if (!text || text.trim().length < 3) {
        setError('Could not read text from image. Try again with better lighting.')
        return null
      }

      const result = {
        cardNumber: extractCardNumber(text),
        securityPin: extractPin(text),
        balance: extractBalance(text),
        cardType: extractCardType(text),
      }

      // Return null if we couldn't extract anything useful
      if (!result.cardNumber && !result.balance && !result.securityPin) {
        setError('Could not detect card details. You can enter them manually.')
        return null
      }

      return result
    } catch (err) {
      setError('Scan failed. Please try again or enter details manually.')
      return null
    } finally {
      setScanning(false)
    }
  }, [])

  return { scan, scanning, error }
}
