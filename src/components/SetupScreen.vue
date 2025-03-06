<template>
  <div class="setup-screen">
    <h2>Enter Number of Students</h2>
    <div class="input-group">
      <label for="studentCount">Number of Students:</label>
      <input
        type="number"
        id="studentCount"
        v-model.number="studentCount"
        min="2"
        :max="maxStudents"
      />
    </div>
    <button
      @click="onCreateGroups"
      :disabled="!isValidStudentCount"
      class="primary-button"
    >
      Create Groups
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  maxStudents: number;
}>();

const emit = defineEmits<{
  (e: 'createGroups', count: number): void;
}>();

const studentCount = ref<number>(10);

const isValidStudentCount = computed(() => {
  return (
    studentCount.value &&
    studentCount.value >= 2 &&
    studentCount.value <= props.maxStudents
  );
});

function onCreateGroups() {
  if (isValidStudentCount.value) {
    emit('createGroups', studentCount.value);
  }
}
</script>

<style scoped>
.setup-screen {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  margin: 15px 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.primary-button {
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.primary-button:hover:not(:disabled) {
  background-color: #3a80d2;
}

.primary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>