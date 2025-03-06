import { describe, it, expect, vi } from 'vitest'

// Create mocks before importing modules that use them
const mockApp = {
  use: vi.fn().mockReturnThis(),
  mount: vi.fn(),
}

// Mock modules with proper Vue exports
vi.mock('vue', async () => ({
  createApp: () => mockApp,
  defineComponent: vi.fn(),
  ref: vi.fn(),
  computed: vi.fn(),
}))

vi.mock('pinia', () => ({
  createPinia: vi.fn(),
}))

vi.mock('../router', () => ({
  default: {},
}))

// Mock CSS imports
vi.mock('../assets/main.css', () => ({}))

// Now we can safely import and test main
describe('Main', () => {
  it('initializes the Vue application correctly', async () => {
    await import('../main')

    expect(mockApp.use).toHaveBeenCalledTimes(2)
    expect(mockApp.mount).toHaveBeenCalledWith('#app')
  })
})
