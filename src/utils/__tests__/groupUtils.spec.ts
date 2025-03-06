import { describe, it, expect, vi } from 'vitest'
import { createGroups } from '../groupUtils'

// Mock the shuffle function from lodash
vi.mock('lodash', () => ({
  shuffle: (arr: any[]) => arr,
}))

describe('groupUtils', () => {
  describe('createGroups', () => {
    it('should create groups of 2, 2, 2, 3 for 9 students', () => {
      const students = []
      const groups = []
      const currentStudentIndex = { value: 0 }
      const currentScreen = { value: 'setup' }
      const shuffle = (arr: any[]) => arr

      // Call the createGroups function
      createGroups(9, students, groups, currentStudentIndex, currentScreen, shuffle)

      // Get the groups from the function
      const groupSizes = groups.map((group) => group.students.length)

      // Sort the groups for comparison
      groupSizes.sort((a, b) => a - b)

      // Check if the groups match the expected output
      expect(groupSizes).toEqual([2, 2, 2, 3])
    })
  })
})
