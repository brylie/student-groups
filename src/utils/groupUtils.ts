interface Student {
  id: number
  name: string
  groupId: number
}

interface Group {
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

  // Assign students to groups while maintaining required group sizes
  let studentIndex = 0
  groups.forEach((group, groupIndex) => {
    const targetSize = groupSizes[groupIndex]
    for (let i = 0; i < targetSize; i++) {
      if (studentIndex >= shuffledStudents.length) {
        break
      }
      const student = shuffledStudents[studentIndex]
      student.groupId = group.id
      group.students.push(student.name)
      studentIndex++
    }
  })

  // Update the students array with the modified objects
  students.length = 0
  students.push(...shuffledStudents)

  // Reset the current student index and move to student view screen
  currentStudentIndex.value = 0
  currentScreen.value = 'studentView'
}
