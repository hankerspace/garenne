import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from '../state/store'
import { storageService } from '../services/storage.service'

// Top-level keys expected in exported JSON
const stateArrayKeys = [
  'animals',
  'breedings',
  'litters',
  'weights',
  'treatments',
  'mortalities',
  'cages',
  'tags',
  'performanceMetrics',
  'goals',
  'goalAchievements',
] as const

const stateKeys = [...stateArrayKeys, 'settings'] as const

// Keys that must not appear in exported JSON (functions/actions)
const forbiddenKeys = [
  'loadData',
  'saveData',
  'loadSeedData',
  'exportData',
  'importData',
  'clearAllData',
  'addAnimal',
  'updateAnimal',
  'deleteAnimal',
] as const

describe('Data export/import', () => {
  let saveSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.restoreAllMocks()
    // Avoid interacting with real localStorage through storageService
    saveSpy = vi.spyOn(storageService, 'save').mockImplementation(() => {})
    // Reset store to a clean state before each test
    useAppStore.getState().clearAllData()
  })

  it('exportData returns valid JSON with expected keys and excludes functions', () => {
    const store = useAppStore.getState()

    // Prepare some data using the built-in seed generator
    store.loadSeedData()

    const exported = store.exportData('json')
    expect(typeof exported).toBe('string')

    const parsed = JSON.parse(exported as string) as Record<string, any>

    // Ensure expected top-level keys exist
    for (const key of stateKeys) {
      expect(parsed).toHaveProperty(key)
    }

    // Ensure function/action keys are not present in exported JSON
    for (const f of forbiddenKeys) {
      expect(parsed).not.toHaveProperty(f)
    }

    // Sanity check: exported animals should be non-empty with seed data
    expect(Array.isArray(parsed.animals)).toBe(true)
    expect(parsed.animals.length).toBeGreaterThan(0)

    // Settings should include a schemaVersion
    expect(parsed.settings).toHaveProperty('schemaVersion')
  })

  it('round-trips data correctly via exportData/importData', () => {
    const store = useAppStore.getState()

    store.loadSeedData()

    const exported = store.exportData('json') as string
    const snapshot = JSON.parse(exported) as Record<string, any>

    // Clear and verify empty
    store.clearAllData()
    for (const key of stateArrayKeys) {
      expect(useAppStore.getState()[key].length).toBe(0)
    }

    const callsBefore = saveSpy.mock.calls.length

    // Import back the snapshot
    store.importData(snapshot)

    // save should have been called once by importData
    expect(saveSpy.mock.calls.length).toBeGreaterThan(callsBefore)

    // Compare array counts after import
    const after = useAppStore.getState()
    for (const key of stateArrayKeys) {
      expect(after[key].length).toBe(snapshot[key].length)
    }

    // Check a couple of representative fields
    expect(after.settings.schemaVersion).toBe(snapshot.settings.schemaVersion)
  })

  it('clearAllData empties all collections and triggers a save', () => {
    const store = useAppStore.getState()

    // Fill with seed data then clear
    store.loadSeedData()
    const callsBefore = saveSpy.mock.calls.length

    store.clearAllData()

    for (const key of stateArrayKeys) {
      expect(useAppStore.getState()[key].length).toBe(0)
    }

    // save should have been called by clearAllData
    expect(saveSpy.mock.calls.length).toBeGreaterThan(callsBefore)
  })
})
