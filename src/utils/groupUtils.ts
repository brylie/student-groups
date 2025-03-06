export interface Student {
  id: number
  name: string
  groupId: number
}

export interface Group {
  id: number
  name: string
  students: string[]
}

// Create random groups of 2-3 students
export function createGroups(
  count: number,
  students: Student[],
  groups: Group[],
  currentStudentIndex: { value: number },
  currentScreen: { value: string },
  shuffle: <T>(array: T[]) => T[],
) {
  const studentCount = { value: count }

  // Reset previous data
  students.length = 0
  groups.length = 0

  // Create student array with IDs
  for (let i = 1; i <= studentCount.value; i++) {
    students.push({
      id: i,
      name: `Student ${i}`,
      groupId: 0,
    })
  }

  // Calculate number of groups and sizes
  let numGroups: number
  let groupSizes: number[]

  if (count <= 4) {
    numGroups = 2
    groupSizes = Array(numGroups).fill(Math.floor(count / 2))
  } else if (count === 9) {
    // Special case for 9 students
    numGroups = 4
    groupSizes = [2, 2, 2, 3]
  } else if (count % 3 === 0) {
    // If divisible by 3, make all groups size 3
    numGroups = count / 3
    groupSizes = Array(numGroups).fill(3)
  } else if (count % 3 === 1 && count > 4) {
    // If count % 3 is 1 and count > 4, make groups of 2 with one group of 3
    numGroups = Math.floor(count / 2)
    groupSizes = Array(numGroups).fill(2)
    groupSizes[numGroups - 1] = 3
  } else {
    // For other cases, try to make groups of 2 with one group of 3 if needed
    numGroups = Math.floor((count + 1) / 2)
    groupSizes = Array(numGroups).fill(2)

    // If there are leftover students after making pairs, adjust last group
    const leftover = count - 2 * (numGroups - 1)
    if (leftover > 0) {
      groupSizes[numGroups - 1] = leftover
    }
  }

  // Create empty groups
  for (let i = 0; i < numGroups; i++) {
    groups.push({
      id: i + 1,
      name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      students: [],
    })
  }

  // First shuffle the students
  const shuffledStudents = shuffle([...students])

  // Initialize an array to track assigned students
  const unassignedStudents = [...shuffledStudents]

  // Assign students to groups while maintaining required group sizes
  const studentIndex = 0
  groups.forEach((group, groupIndex) => {
    const targetSize = groupSizes[groupIndex]
    const groupStudents: Student[] = []

    // Fill the group while trying to avoid neighbor pairs
    while (groupStudents.length < targetSize && unassignedStudents.length > 0) {
      // Try to find a student who isn't adjacent to the last assigned student
      let bestCandidateIndex = 0
      let minNeighborCount = Infinity

      // Look through unassigned students to find the best candidate
      for (let i = 0; i < unassignedStudents.length; i++) {
        const candidate = unassignedStudents[i]
        let neighborCount = 0

        // Check if this student is adjacent to any already assigned students in the group
        if (groupStudents.length > 0) {
          const lastAssigned = groupStudents[groupStudents.length - 1]
          // Check if they are neighbors in the original array
          if (Math.abs(candidate.id - lastAssigned.id) === 1) {
            neighborCount++
          }
        }

        // If we found a better candidate, update our selection
        if (neighborCount < minNeighborCount) {
          minNeighborCount = neighborCount
          bestCandidateIndex = i
        }

        // If we found a candidate with no neighbors, use them immediately
        if (minNeighborCount === 0) {
          break
        }
      }

      // Assign the best candidate to this group
      const student = unassignedStudents.splice(bestCandidateIndex, 1)[0]
      student.groupId = group.id
      group.students.push(student.name)
      groupStudents.push(student)
    }
  })

  // Update the students array with the modified objects
  students.length = 0
  const sortedStudents = shuffledStudents.sort((a, b) => a.id - b.id)
  students.push(...sortedStudents)

  // Reset the current student index and move to student view screen
  currentStudentIndex.value = 0
  currentScreen.value = 'studentView'
}
