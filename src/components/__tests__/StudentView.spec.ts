import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentView from '../StudentView.vue'

describe('StudentView', () => {
  const mockStudents = [
    { id: 1, name: 'Student 1', groupId: 1 },
    { id: 2, name: 'Student 2', groupId: 1 },
    { id: 3, name: 'Student 3', groupId: 2 },
  ]

  const mockGroups = [
    { id: 1, name: 'A', students: ['Student 1', 'Student 2'] },
    { id: 2, name: 'B', students: ['Student 3'] },
  ]

  it('renders properly with student and group information', () => {
    const wrapper = mount(StudentView, {
      props: {
        currentStudentIndex: 0,
        totalStudents: 3,
        students: mockStudents,
        groups: mockGroups,
      },
    })

    expect(wrapper.find('.student-number').text()).toBe('Student 1')
    expect(wrapper.find('.group-name').text()).toBe('Group A')
  })

  it('handles navigation button states correctly', async () => {
    const wrapper = mount(StudentView, {
      props: {
        currentStudentIndex: 1,
        totalStudents: 3,
        students: mockStudents,
        groups: mockGroups,
      },
    })

    const [prevButton, nextButton] = wrapper.findAll('button').slice(0, 2)

    expect(prevButton.attributes('disabled')).toBeUndefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()

    // First student
    await wrapper.setProps({ currentStudentIndex: 0 })
    expect(prevButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()

    // Last student
    await wrapper.setProps({ currentStudentIndex: 2 })
    expect(prevButton.attributes('disabled')).toBeUndefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('emits navigation events', async () => {
    const wrapper = mount(StudentView, {
      props: {
        currentStudentIndex: 1,
        totalStudents: 3,
        students: mockStudents,
        groups: mockGroups,
      },
    })

    const [prevButton, nextButton, resetButton] = wrapper.findAll('button')

    await prevButton.trigger('click')
    expect(wrapper.emitted('previous')).toBeTruthy()

    await nextButton.trigger('click')
    expect(wrapper.emitted('next')).toBeTruthy()

    await resetButton.trigger('click')
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('handles empty or invalid data gracefully', () => {
    const wrapper = mount(StudentView, {
      props: {
        currentStudentIndex: 0,
        totalStudents: 0,
        students: [],
        groups: [],
      },
    })

    expect(wrapper.find('.group-name').text()).toBe('Group')
  })
})
