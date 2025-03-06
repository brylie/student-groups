import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SetupScreen from '../SetupScreen.vue'

describe('SetupScreen', () => {
  it('renders properly', () => {
    const wrapper = mount(SetupScreen, {
      props: {
        maxStudents: 100,
      },
    })

    expect(wrapper.find('h2').text()).toBe('Enter Number of Students')
    expect(wrapper.find('label').text()).toBe('Number of Students:')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create Groups')
  })

  it('validates student count input', async () => {
    const wrapper = mount(SetupScreen, {
      props: {
        maxStudents: 100,
      },
    })

    const input = wrapper.find('input')
    const button = wrapper.find('button')

    // Initial state (default value 10)
    expect(button.attributes('disabled')).toBeUndefined()

    // Invalid values
    await input.setValue(1) // Below minimum
    expect(button.attributes('disabled')).toBeDefined()

    await input.setValue(101) // Above maximum
    expect(button.attributes('disabled')).toBeDefined()

    await input.setValue('') // Empty
    expect(button.attributes('disabled')).toBeDefined()

    // Valid values
    await input.setValue(2) // Minimum
    expect(button.attributes('disabled')).toBeUndefined()

    await input.setValue(50) // Middle range
    expect(button.attributes('disabled')).toBeUndefined()

    await input.setValue(100) // Maximum
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('emits createGroups event with correct value', async () => {
    const wrapper = mount(SetupScreen, {
      props: {
        maxStudents: 100,
      },
    })

    await wrapper.find('input').setValue(15)
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('createGroups')
    expect(wrapper.emitted('createGroups')?.[0]).toEqual([15])
  })
})
