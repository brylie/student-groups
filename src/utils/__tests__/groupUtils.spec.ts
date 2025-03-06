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

    it('should distribute students randomly and avoid grouping neighbors together', () => {
      const iterations = 100 // Run multiple iterations to get meaningful statistics
      const testCases = [5, 6, 7, 8, 9, 10, 11]
      const maxNeighborFrequency = 0.3 // Maximum 30% of students should be with their neighbors

      for (const count of testCases) {
        console.log(`\nTesting ${count} students:`)
        let totalNeighborPairs = 0

        // Run multiple iterations to get meaningful statistics
        for (let i = 0; i < iterations; i++) {
          const students: Student[] = []
          const groups: Group[] = []
          const currentStudentIndex = { value: 0 }
          const currentScreen = { value: 'setup' }

          // Use a real shuffle function instead of the mock
          const realShuffle = <T>(arr: T[]): T[] => {
            const result = [...arr]
            for (let i = result.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1))
              ;[result[i], result[j]] = [result[j], result[i]]
            }
            return result
          }

          createGroups(count, students, groups, currentStudentIndex, currentScreen, realShuffle)

          // Count how many students are grouped with their neighbors
          for (let j = 1; j < students.length; j++) {
            if (students[j].groupId === students[j - 1].groupId) {
              totalNeighborPairs++
            }
          }
        }

        // Calculate the frequency of neighbor pairs
        const maxPossiblePairs = (count - 1) * iterations // Maximum possible neighbor pairs across all iterations
        const neighborFrequency = totalNeighborPairs / maxPossiblePairs

        console.log(`Neighbor grouping frequency: ${(neighborFrequency * 100).toFixed(1)}%`)

        // Assert that the neighbor frequency is below our threshold
        expect(neighborFrequency).toBeLessThan(maxNeighborFrequency)
      }
    })
  })
})
