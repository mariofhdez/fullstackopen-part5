import { test, expect } from '@playwright/test'
import { loginWith } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'John Doe',
        username: 'jdoe',
        password: 'password',
      },
    })
    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('Login')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByText('Log in')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'jdoe', 'password')

    await expect(page.getByText('John Doe')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'jdoe', 'wrong')

    const errorMessageDiv = page.locator('.error')

    await expect(errorMessageDiv).toContainText('Wrong username or password')
    await expect(errorMessageDiv).toHaveCSS('border-style', 'solid')
    await expect(errorMessageDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('John Doe')).not.toBeVisible()
  })
})
