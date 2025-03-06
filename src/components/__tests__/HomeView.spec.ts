import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../../views/HomeView.vue'
import SetupScreen from '../SetupScreen.vue'
import StudentView from '../StudentView.vue'

// Define the type for HomeView's exposed properties
interface HomeViewType {
  currentStudentIndex: number
  students: Array<{ id: number; name: string; groupId: number }>
  groups: Array<{ id: number; name: string; students: string[] }>
}

describe('HomeView', () => {
  let wrapper: ReturnType<typeof mount<typeof HomeView>>

  beforeEach(() => {
    wrapper = mount(HomeView)
  })

  it('initially shows setup screen', () => {
    expect(wrapper.findComponent(SetupScreen).exists()).toBe(true)
    expect(wrapper.findComponent(StudentView).exists()).toBe(false)
  })

  it('switches to student view after creating groups', async () => {
    const setupScreen = wrapper.findComponent(SetupScreen)
    await setupScreen.vm.$emit('createGroups', 5)

    // Should switch to student view
    expect(wrapper.findComponent(SetupScreen).exists()).toBe(false)
    expect(wrapper.findComponent(StudentView).exists()).toBe(true)
  })

  it('handles student navigation correctly', async () => {
    // Create groups first
    const setupScreen = wrapper.findComponent(SetupScreen)
    await setupScreen.vm.$emit('createGroups', 5)

    const studentView = wrapper.findComponent(StudentView)

    // Test next navigation
    await studentView.vm.$emit('next')
    expect((wrapper.vm as unknown as HomeViewType).currentStudentIndex).toBe(1)

    // Test previous navigation
    await studentView.vm.$emit('previous')
    expect((wrapper.vm as unknown as HomeViewType).currentStudentIndex).toBe(0)

    // Test reset
    await studentView.vm.$emit('reset')
    expect(wrapper.findComponent(SetupScreen).exists()).toBe(true)
    expect(wrapper.findComponent(StudentView).exists()).toBe(false)
    expect((wrapper.vm as unknown as HomeViewType).currentStudentIndex).toBe(0)
    expect((wrapper.vm as unknown as HomeViewType).students.length).toBe(0)
    expect((wrapper.vm as unknown as HomeViewType).groups.length).toBe(0)
  })
})
