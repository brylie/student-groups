<template>
  <div class="student-groups">
    <header>
      <h1>Student Group Assigner</h1>
    </header>
    
    <main>
      <SetupScreen 
        v-if="currentScreen === 'setup'"
        :maxStudents="maxStudents"
        @create-groups="createGroups"
      />

      <StudentView 
        v-if="currentScreen === 'studentView'"
        :currentStudentIndex="currentStudentIndex"
        :totalStudents="studentCount"
        :students="students"
        :groups="groups"
        @previous="previousStudent"
        @next="nextStudent"
        @reset="resetApp"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { shuffle } from 'lodash';
import SetupScreen from '@/components/SetupScreen.vue';
import StudentView from '@/components/StudentView.vue';

// Types
interface Student {
  id: number;
  name: string;
  groupId: number;
}

interface Group {
  id: number;
  name: string;
  students: string[];
}

// App state
const currentScreen = ref<'setup' | 'studentView'>('setup');
const maxStudents = ref<number>(100);
const studentCount = ref<number>(0);
const students = ref<Student[]>([]);
const groups = ref<Group[]>([]);
const currentStudentIndex = ref<number>(0);

// Create random groups of 2-3 students
function createGroups(count: number) {
  studentCount.value = count;
  
  // Reset previous data
  students.value = [];
  groups.value = [];
  
  // Create student array with IDs
  for (let i = 1; i <= studentCount.value; i++) {
    students.value.push({
      id: i,
      name: `Student ${i}`,
      groupId: 0
    });
  }
  
  // Determine number of groups (prefer pairs)
  let numGroups = Math.ceil(studentCount.value / 2);
  
  // Create empty groups
  for (let i = 0; i < numGroups; i++) {
    groups.value.push({
      id: i + 1,
      name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      students: []
    });
  }

  // Approach: Use a completely different method
  // 1. Shuffle the students array using lodash
  // 2. For each student, pick a random group from the available groups
  // 3. Ensure we don't overfill groups (no group should have more than 3 students if possible)
  
  // First, shuffle the students
  const shuffledStudents = shuffle([...students.value]);
  
  // Create an array to track how many students are in each group
  const studentsPerGroup = Array(numGroups).fill(0);
  
  // Maximum students per group (aim for 2-3 per group)
  const maxStudentsPerGroup = Math.ceil(studentCount.value / numGroups);
  
  // Now assign each student to a group
  for (const student of shuffledStudents) {
    // Create a list of groups that aren't at max capacity yet
    const availableGroups = groups.value.filter((_, index) => 
      studentsPerGroup[index] < maxStudentsPerGroup);
    
    // If all groups are at max capacity, just pick any group
    const targetGroups = availableGroups.length > 0 ? availableGroups : groups.value;
    
    // Select a random group from available groups
    const randomIndex = Math.floor(Math.random() * targetGroups.length);
    const selectedGroup = targetGroups[randomIndex];
    
    // Add student to this group
    student.groupId = selectedGroup.id;
    selectedGroup.students.push(student.name);
    
    // Update our count of students in this group
    studentsPerGroup[groups.value.indexOf(selectedGroup)]++;
  }
  
  // Update the students array with the modified objects
  students.value = shuffledStudents;
  
  // Reset the current student index and move to student view screen
  currentStudentIndex.value = 0;
  currentScreen.value = 'studentView';
}

// Navigation methods
function nextStudent() {
  if (currentStudentIndex.value < studentCount.value - 1) {
    currentStudentIndex.value++;
  }
}

function previousStudent() {
  if (currentStudentIndex.value > 0) {
    currentStudentIndex.value--;
  }
}

// Reset the app to initial state
function resetApp() {
  currentScreen.value = 'setup';
  students.value = [];
  groups.value = [];
  currentStudentIndex.value = 0;
}
</script>

<style scoped>
.student-groups {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

header {
  background-color: #4a90e2;
  color: white;
  padding: 20px;
  text-align: center;
}

main {
  padding: 20px;
}
</style>
