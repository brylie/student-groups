import { describe, it, expect, vi } from 'vitest'
import { createGroups } from '../groupUtils'
import type { Student, Group } from '../groupUtils'

// Mock the shuffle function from lodash
vi.mock('lodash', () => ({
  shuffle: <T>(arr: T[]) => arr,
}))

// Create a helper function to setup the test environment
function setupTest(studentCount: number) {
  const students: Student[] = []
  const groups: Group[] = []
  const currentStudentIndex = { value: 0 }
  const currentScreen = { value: 'setup' }
  // Create a mock shuffle that reverses the array to simulate randomization
  const mockShuffle = <T>(arr: T[]) => [...arr].reverse()

  createGroups(studentCount, students, groups, currentStudentIndex, currentScreen, mockShuffle)

  // Return the student-to-group assignments in order
  return students.map((student) => {
    const group = groups.find((g) => g.id === student.groupId)
    return group?.name || ''
  })
}

describe('groupUtils', () => {
  describe('createGroups', () => {
    it('should create groups of 2, 2, 2, 3 for 9 students', () => {
      const students: Student[] = []
      const groups: Group[] = []
      const currentStudentIndex = { value: 0 }
      const currentScreen = { value: 'setup' }
      const shuffle = <T>(arr: T[]): T[] => arr

      createGroups(9, students, groups, currentStudentIndex, currentScreen, shuffle)

      const groupSizes = groups.map((group) => group.students.length)
      groupSizes.sort((a, b) => a - b)
      console.log('Group sizes:', groupSizes)
      expect(groupSizes).toEqual([2, 2, 2, 3])
    })

    it('should distribute students randomly for different group sizes', () => {
      // Test each student count
      const testCases = [5, 6, 7, 8, 9, 10, 11]

      for (const count of testCases) {
        console.log(`\nTesting ${count} students:`)
        const assignments = setupTest(count)
        console.log('Group assignments:', assignments.join(', '))

        // Verify that consecutive students aren't always in the same group
        let consecutiveSameGroup = 0
        for (let i = 1; i < assignments.length; i++) {
          if (assignments[i] === assignments[i - 1]) {
            consecutiveSameGroup++
          }
        }

        // We expect some consecutive assignments to be different due to randomization
        expect(consecutiveSameGroup).toBeLessThan(assignments.length - 1)
      }
    })
  })
})
