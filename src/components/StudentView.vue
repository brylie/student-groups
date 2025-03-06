<template>
  <div class="student-view">
    <div class="student-card">
      <h2>Student {{ currentStudentIndex + 1 }}</h2>
      <div class="group-info">
        <h3>Your Group: {{ currentGroup.name }}</h3>
        <p>Group Members: {{ currentGroup.students.join(', ') }}</p>
      </div>
    </div>

    <div class="navigation">
      <button @click="previousStudent" :disabled="currentStudentIndex === 0">
        Previous
      </button>
      <span>{{ currentStudentIndex + 1 }} of {{ totalStudents }}</span>
      <button @click="nextStudent" :disabled="currentStudentIndex >= totalStudents - 1">
        Next
      </button>
    </div>

    <button @click="$emit('reset')" class="secondary-button">
      Start Over
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const props = defineProps<{
  currentStudentIndex: number;
  totalStudents: number;
  students: Student[];
  groups: Group[];
}>();

const emit = defineEmits<{
  (e: 'previous'): void;
  (e: 'next'): void;
  (e: 'reset'): void;
}>();

const currentGroup = computed(() => {
  if (!props.students.length || props.currentStudentIndex < 0 || props.currentStudentIndex >= props.students.length) {
    return { name: '', students: [] };
  }
  
  const currentStudent = props.students[props.currentStudentIndex];
  const groupId = currentStudent.groupId;
  return props.groups.find(group => group.id === groupId) || { name: '', students: [] };
});

function nextStudent() {
  emit('next');
}

function previousStudent() {
  emit('previous');
}
</script>

<style scoped>
.student-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.group-info {
  margin-top: 15px;
  text-align: center;
}

.group-info h3 {
  color: #4a90e2;
  margin-bottom: 10px;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.navigation button {
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navigation button:hover:not(:disabled) {
  background-color: #3a80d2;
}

.navigation button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.secondary-button:hover {
  background-color: #d0d0d0;
}
</style>