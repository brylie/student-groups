<template>
  <div class="student-groups">
    <header>
      <h1>Student Group Assigner</h1>
    </header>

    <main>
      <SetupScreen
        v-if="currentScreen === 'setup'"
        :maxStudents="maxStudents"
        @create-groups="createGroupsWrapper"
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
import { ref } from 'vue'
import { shuffle } from 'lodash'
import SetupScreen from '@/components/SetupScreen.vue'
import StudentView from '@/components/StudentView.vue'
import { createGroups } from '@/utils/groupUtils'

// Types
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

// App state
const currentScreen = ref<'setup' | 'studentView'>('setup')
const maxStudents = ref<number>(100)
const studentCount = ref<number>(0)
const students = ref<Student[]>([])
const groups = ref<Group[]>([])
const currentStudentIndex = ref<number>(0)

// Create random groups of 2-3 students
function createGroupsWrapper(count: number) {
  studentCount.value = count
  createGroups(count, students.value, groups.value, currentStudentIndex, currentScreen, shuffle)
}

// Navigation methods
function nextStudent() {
  if (currentStudentIndex.value < studentCount.value - 1) {
    currentStudentIndex.value++
  }
}

function previousStudent() {
  if (currentStudentIndex.value > 0) {
    currentStudentIndex.value--
  }
}

// Reset the app to initial state
function resetApp() {
  currentScreen.value = 'setup'
  students.value = []
  groups.value = []
  currentStudentIndex.value = 0
}
</script>

<style scoped>
.student-groups {
  width: 100%;
  max-width: 600px;
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
