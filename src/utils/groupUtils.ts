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

export interface GroupSizeResult {
  numGroups: number
  groupSizes: number[]
}

export function calculateGroupSizes(count: number): GroupSizeResult {
  let numGroups: number
  let groupSizes: number[]

  if (count <= 3) {
    // Special case for very small groups
    numGroups = 1
    groupSizes = [count]
  } else if (count % 2 === 0) {
    // If even number, make all pairs
    numGroups = count / 2
    groupSizes = Array(numGroups).fill(2)
  } else {
    // For odd numbers, make pairs with one group of 3
    numGroups = Math.floor(count / 2)
    groupSizes = Array(numGroups).fill(2)
    groupSizes[numGroups - 1] = 3
  }

  return { numGroups, groupSizes }
}

export function createEmptyGroup(id: number): Group {
  return {
    id,
    name: `Group ${String.fromCharCode(64 + id)}`, // A, B, C, etc.
    students: [],
  }
}

export function createInitialStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    groupId: 0,
  }))
}

export function findBestCandidate(unassignedStudents: Student[], groupStudents: Student[]): number {
  // If no students in group yet, return first unassigned student
  if (groupStudents.length === 0) {
    return 0
  }

  let bestCandidateIndex = 0
  let minNeighborCount = Infinity
  let foundNonNeighbor = false

  // Look through unassigned students to find the best candidate
  for (let i = 0; i < unassignedStudents.length; i++) {
    const candidate = unassignedStudents[i]
    let isNeighbor = false

    // Check if this student is adjacent to the last assigned student
    const lastAssigned = groupStudents[groupStudents.length - 1]
    if (Math.abs(candidate.id - lastAssigned.id) === 1) {
      isNeighbor = true
    }

    // If we haven't found a non-neighbor yet and this student isn't a neighbor
    if (!foundNonNeighbor && !isNeighbor) {
      bestCandidateIndex = i
      foundNonNeighbor = true
      minNeighborCount = 0
    }
    // If we haven't found a non-neighbor, keep track of the current best neighbor
    else if (!foundNonNeighbor && isNeighbor) {
      bestCandidateIndex = i
      minNeighborCount = 1
    }
  }

  return bestCandidateIndex
}

export function assignStudentsToGroups(
  students: Student[],
  groupSizes: number[],
  shuffle: <T>(array: T[]) => T[],
): Group[] {
  // First shuffle the students
  const shuffledStudents = shuffle([...students])
  const unassignedStudents = [...shuffledStudents]
  const groups: Group[] = []

  // Create and fill groups
  groupSizes.forEach((targetSize, index) => {
    const group = createEmptyGroup(index + 1)
    const groupStudents: Student[] = []

    // Fill the group while trying to avoid neighbor pairs
    while (groupStudents.length < targetSize && unassignedStudents.length > 0) {
      const bestCandidateIndex = findBestCandidate(unassignedStudents, groupStudents)
      const student = unassignedStudents.splice(bestCandidateIndex, 1)[0]
      student.groupId = group.id
      group.students.push(student.name)
      groupStudents.push(student)
    }

    groups.push(group)
  })

  return groups
}

// Main function that orchestrates the group creation process
export function createGroups(
  count: number,
  students: Student[],
  groups: Group[],
  currentStudentIndex: { value: number },
  currentScreen: { value: string },
  shuffle: <T>(array: T[]) => T[],
) {
  // Reset previous data
  students.length = 0
  groups.length = 0

  // Calculate group sizes
  const { groupSizes } = calculateGroupSizes(count)

  // Create initial students
  const initialStudents = createInitialStudents(count)

  // Create and assign groups
  const newGroups = assignStudentsToGroups(initialStudents, groupSizes, shuffle)

  // Update the reference arrays
  groups.push(...newGroups)
  students.push(...initialStudents.sort((a, b) => a.id - b.id))

  // Reset the current student index and move to student view screen
  currentStudentIndex.value = 0
  currentScreen.value = 'studentView'
}
