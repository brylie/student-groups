import { describe, it, expect } from 'vitest'
import router from '../index'

describe('Router', () => {
  it('has correct routes configured', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(1)

    const homeRoute = routes[0]
    expect(homeRoute.path).toBe('/')
    expect(homeRoute.name).toBe('home')
    // Component is dynamically imported, so we can only check it exists
    expect(homeRoute.components).toBeDefined()
  })
})
