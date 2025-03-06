<template>
  <div class="student-view">
    <div class="student-card">
      <div class="student-info">
        <span class="student-number">Student {{ currentStudentIndex + 1 }}</span>
      </div>
      <div class="group-info">
        <h2 class="group-name">Group {{ currentGroup.name }}</h2>
      </div>
    </div>

    <div class="navigation">
      <button @click="previousStudent" :disabled="currentStudentIndex === 0">Previous</button>
      <span>{{ currentStudentIndex + 1 }} of {{ totalStudents }}</span>
      <button @click="nextStudent" :disabled="currentStudentIndex >= totalStudents - 1">
        Next
      </button>
    </div>

    <button @click="$emit('reset')" class="secondary-button">Start Over</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
  currentStudentIndex: number
  totalStudents: number
  students: Student[]
  groups: Group[]
}>()

const emit = defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'reset'): void
}>()

const currentGroup = computed(() => {
  if (
    !props.students.length ||
    props.currentStudentIndex < 0 ||
    props.currentStudentIndex >= props.students.length
  ) {
    return { name: '', students: [] }
  }

  const currentStudent = props.students[props.currentStudentIndex]
  const groupId = currentStudent.groupId
  return props.groups.find((group) => group.id === groupId) || { name: '', students: [] }
})

function nextStudent() {
  emit('next')
}

function previousStudent() {
  emit('previous')
}
</script>

<style scoped>
.student-view {
  max-width: 600px;
  margin: 0 auto;
}

.student-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 2rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.student-info {
  margin-bottom: 1.5rem;
}

.student-number {
  font-size: 1.2rem;
  color: #666;
}

.group-info {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.group-name {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 1rem;
}

.navigation button {
  background-color: #4a90e2;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.navigation button:hover:not(:disabled) {
  background-color: #357abd;
}

.navigation button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.navigation span {
  font-size: 1.1rem;
  color: #666;
}

.secondary-button {
  background-color: #f0f0f0;
  color: #333;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: #e0e0e0;
}
</style>
