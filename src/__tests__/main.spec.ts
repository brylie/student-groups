import { beforeEach, describe, it, expect, vi } from 'vitest'

// Create mocks before importing modules that use them
const mockApp = {
  use: vi.fn().mockReturnThis(),
  mount: vi.fn(),
}

// Mock Vue with all necessary exports
vi.mock('vue', () => ({
  createApp: () => mockApp,
  defineComponent: vi.fn((x) => x),
  ref: vi.fn(),
  computed: vi.fn(),
  __esModule: true,
  default: {
    defineComponent: vi.fn((x) => x),
    __vccOpts: { expose: vi.fn() },
  },
}))

vi.mock('pinia', () => ({
  createPinia: vi.fn(),
}))

vi.mock('../router', () => ({
  default: {},
}))

// Mock App component
vi.mock('../App.vue', () => ({
  default: {
    __vccOpts: { expose: vi.fn() },
  },
}))

// Mock CSS imports
vi.mock('../assets/main.css', () => ({}))

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes the Vue application correctly', async () => {
    await import('../main')
    expect(mockApp.use).toHaveBeenCalledTimes(2)
    expect(mockApp.mount).toHaveBeenCalledWith('#app')
  })
})
