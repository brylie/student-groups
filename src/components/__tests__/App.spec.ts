import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'
import HomeView from '../../views/HomeView.vue'

describe('App', () => {
  it('renders HomeView component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(HomeView).exists()).toBe(true)
  })
})
