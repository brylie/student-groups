// Create random groups of 2-3 students
export function createGroups(
  count: number,
  students: any[],
  groups: any[],
  currentStudentIndex: any,
  currentScreen: any,
  shuffle: any,
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

  // For 9 students, we want exactly 4 groups
  const numGroups = 4

  // Create empty groups
  for (let i = 0; i < numGroups; i++) {
    groups.push({
      id: i + 1,
      name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      students: [],
    })
  }

  // Shuffle the students
  const shuffledStudents = shuffle([...students])

  // Distribute 2 students to first three groups
  for (let i = 0; i < 3; i++) {
    const student1 = shuffledStudents[i * 2]
    const student2 = shuffledStudents[i * 2 + 1]

    student1.groupId = groups[i].id
    student2.groupId = groups[i].id
    groups[i].students.push(student1.name, student2.name)
  }

  // Add remaining 3 students to the last group
  for (let i = 6; i < 9; i++) {
    const student = shuffledStudents[i]
    student.groupId = groups[3].id
    groups[3].students.push(student.name)
  }

  // Update the students array with the modified objects
  students.length = 0
  students.push(...shuffledStudents)

  // Reset the current student index and move to student view screen
  currentStudentIndex.value = 0
  currentScreen.value = 'studentView'
}
