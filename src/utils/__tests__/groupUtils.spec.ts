import { describe, it, expect, vi } from 'vitest'
import {
  calculateGroupSizes,
  createEmptyGroup,
  createInitialStudents,
  findBestCandidate,
  assignStudentsToGroups,
  createGroups,
  type Student,
  type Group,
} from '../groupUtils'

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
  describe('calculateGroupSizes', () => {
    it('should handle small groups of 3 or fewer students', () => {
      expect(calculateGroupSizes(3)).toEqual({ numGroups: 1, groupSizes: [3] })
      expect(calculateGroupSizes(2)).toEqual({ numGroups: 1, groupSizes: [2] })
      expect(calculateGroupSizes(1)).toEqual({ numGroups: 1, groupSizes: [1] })
    })

    it('should create pairs for even numbers of students', () => {
      expect(calculateGroupSizes(4)).toEqual({ numGroups: 2, groupSizes: [2, 2] })
      expect(calculateGroupSizes(6)).toEqual({ numGroups: 3, groupSizes: [2, 2, 2] })
      expect(calculateGroupSizes(8)).toEqual({ numGroups: 4, groupSizes: [2, 2, 2, 2] })
    })

    it('should create pairs with one group of three for odd numbers', () => {
      expect(calculateGroupSizes(5)).toEqual({ numGroups: 2, groupSizes: [2, 3] })
      expect(calculateGroupSizes(7)).toEqual({ numGroups: 3, groupSizes: [2, 2, 3] })
      expect(calculateGroupSizes(9)).toEqual({ numGroups: 4, groupSizes: [2, 2, 2, 3] })
    })
  })

  describe('createEmptyGroup', () => {
    it('should create a group with the correct ID and name', () => {
      const group1 = createEmptyGroup(1)
      expect(group1).toEqual({
        id: 1,
        name: 'Group A',
        students: [],
      })

      const group3 = createEmptyGroup(3)
      expect(group3).toEqual({
        id: 3,
        name: 'Group C',
        students: [],
      })
    })
  })

  describe('createInitialStudents', () => {
    it('should create the correct number of students with sequential IDs', () => {
      const students = createInitialStudents(3)
      expect(students).toEqual([
        { id: 1, name: 'Student 1', groupId: 0 },
        { id: 2, name: 'Student 2', groupId: 0 },
        { id: 3, name: 'Student 3', groupId: 0 },
      ])
    })
  })

  describe('findBestCandidate', () => {
    it('should prefer students who are not neighbors', () => {
      const unassignedStudents: Student[] = [
        { id: 1, name: 'Student 1', groupId: 0 },
        { id: 3, name: 'Student 3', groupId: 0 },
        { id: 4, name: 'Student 4', groupId: 0 },
      ]
      const groupStudents: Student[] = [{ id: 2, name: 'Student 2', groupId: 1 }]

      const bestIndex = findBestCandidate(unassignedStudents, groupStudents)
      const selectedStudent = unassignedStudents[bestIndex]
      expect(Math.abs(selectedStudent.id - groupStudents[0].id)).toBeGreaterThan(1)
    })

    it('should work with an empty group', () => {
      const unassignedStudents: Student[] = [
        { id: 1, name: 'Student 1', groupId: 0 },
        { id: 2, name: 'Student 2', groupId: 0 },
      ]
      const groupStudents: Student[] = []

      const bestIndex = findBestCandidate(unassignedStudents, groupStudents)
      expect(bestIndex).toBe(0) // Should pick the first student when group is empty
    })
  })

  describe('assignStudentsToGroups', () => {
    it('should assign students to groups of the correct sizes', () => {
      const students = createInitialStudents(5)
      const groupSizes = [2, 3]
      const mockShuffle = <T>(arr: T[]): T[] => [...arr]

      const groups = assignStudentsToGroups(students, groupSizes, mockShuffle)

      expect(groups).toHaveLength(2)
      expect(groups[0].students).toHaveLength(2)
      expect(groups[1].students).toHaveLength(3)
    })

    it('should assign all students to groups', () => {
      const students = createInitialStudents(6)
      const groupSizes = [3, 3]
      const mockShuffle = <T>(arr: T[]): T[] => [...arr]

      const groups = assignStudentsToGroups(students, groupSizes, mockShuffle)

      const totalAssignedStudents = groups.reduce((sum, group) => sum + group.students.length, 0)
      expect(totalAssignedStudents).toBe(6)
    })
  })

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
