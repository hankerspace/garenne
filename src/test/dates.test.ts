import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  calculateAge, 
  calculateAgeText, 
  toISODate, 
  isWithdrawalActive 
} from '../utils/dates'

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toBe('15/01/2024')
    })

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBe('15/01/2024')
    })

    it('should accept custom format string', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date, 'yyyy-MM-dd')
      expect(formatted).toBe('2024-01-15')
    })
  })

  describe('toISODate', () => {
    it('should convert Date to ISO date string', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const isoDate = toISODate(date)
      expect(isoDate).toBe('2024-01-15')
    })
  })

  describe('calculateAge', () => {
    it('should calculate age in days', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      
      const age = calculateAge(toISODate(yesterday))
      expect(age).toBe(1)
    })
  })

  describe('calculateAgeText', () => {
    it('should return days for less than 30 days', () => {
      const date = new Date()
      date.setDate(date.getDate() - 5)
      
      const ageText = calculateAgeText(toISODate(date))
      expect(ageText).toBe('5 jours')
    })

    it('should return months for less than 365 days', () => {
      const date = new Date()
      date.setDate(date.getDate() - 60) // 2 months
      
      const ageText = calculateAgeText(toISODate(date))
      expect(ageText).toBe('2 mois')
    })

    it('should return years for more than 365 days', () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      date.setDate(date.getDate() - 10) // A bit more than 1 year
      
      const ageText = calculateAgeText(toISODate(date))
      expect(ageText).toContain('1 an')
    })
  })

  describe('isWithdrawalActive', () => {
    it('should return true for future withdrawal date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      
      const isActive = isWithdrawalActive(toISODate(futureDate))
      expect(isActive).toBe(true)
    })

    it('should return false for past withdrawal date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 5)
      
      const isActive = isWithdrawalActive(toISODate(pastDate))
      expect(isActive).toBe(false)
    })

    it('should return false for undefined withdrawal date', () => {
      const isActive = isWithdrawalActive(undefined)
      expect(isActive).toBe(false)
    })
  })
})