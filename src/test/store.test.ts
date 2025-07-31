import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../state/store'
import { Sex, Status } from '../models/types'

describe('Animal Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAppStore.getState().clearAllData()
  })

  it('should add an animal', () => {
    const { addAnimal, animals } = useAppStore.getState()
    
    const animalData = {
      name: 'Test Animal',
      sex: Sex.Female,
      status: Status.Grow,
      breed: 'Test Breed',
    }
    
    const newAnimal = addAnimal(animalData)
    
    expect(newAnimal).toHaveProperty('id')
    expect(newAnimal).toHaveProperty('createdAt')
    expect(newAnimal).toHaveProperty('updatedAt')
    expect(newAnimal.name).toBe('Test Animal')
    expect(newAnimal.sex).toBe(Sex.Female)
    expect(newAnimal.status).toBe(Status.Grow)
    
    const updatedAnimals = useAppStore.getState().animals
    expect(updatedAnimals).toHaveLength(1)
    expect(updatedAnimals[0]).toEqual(newAnimal)
  })

  it('should update an animal', () => {
    const { addAnimal, updateAnimal } = useAppStore.getState()
    
    const animal = addAnimal({
      name: 'Original Name',
      sex: Sex.Male,
      status: Status.Grow,
    })
    
    updateAnimal(animal.id, {
      name: 'Updated Name',
      status: Status.Reproducer,
    })
    
    const updatedAnimals = useAppStore.getState().animals
    expect(updatedAnimals[0].name).toBe('Updated Name')
    expect(updatedAnimals[0].status).toBe(Status.Reproducer)
    expect(updatedAnimals[0].sex).toBe(Sex.Male) // Should remain unchanged
  })

  it('should delete an animal', () => {
    const { addAnimal, deleteAnimal } = useAppStore.getState()
    
    const animal = addAnimal({
      name: 'To Delete',
      sex: Sex.Female,
      status: Status.Grow,
    })
    
    expect(useAppStore.getState().animals).toHaveLength(1)
    
    deleteAnimal(animal.id)
    
    expect(useAppStore.getState().animals).toHaveLength(0)
  })

  it('should handle multiple animals', () => {
    const { addAnimal } = useAppStore.getState()
    
    const animal1 = addAnimal({
      name: 'Animal 1',
      sex: Sex.Female,
      status: Status.Grow,
    })
    
    const animal2 = addAnimal({
      name: 'Animal 2',
      sex: Sex.Male,
      status: Status.Reproducer,
    })
    
    const animals = useAppStore.getState().animals
    expect(animals).toHaveLength(2)
    expect(animals.find(a => a.id === animal1.id)).toBeTruthy()
    expect(animals.find(a => a.id === animal2.id)).toBeTruthy()
  })
})