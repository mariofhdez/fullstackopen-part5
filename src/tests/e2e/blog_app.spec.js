import { test, expect } from '@playwright/test'
import { createBlog, loginWith } from './helper'

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

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'jdoe', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog from playwright',
        'playwright',
        'http://localhost'
      )

      const blogListDiv = await page.locator('.blog')
      await expect(
        blogListDiv.getByText('a blog from playwright')
      ).toBeVisible()
      await expect(blogListDiv.getByText('playwright')).toBeVisible()
      await expect(blogListDiv.getByText('http://localhost')).not.toBeVisible()
    })

    test.describe('and a blog exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'a permanent blog',
          'playwright',
          'http://localhost'
        )
      })

      test('it can be updated', async ({ page }) => {
        const blog = await page.locator('.blog')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByTestId('likes')).toContainText('0')

        await blog.getByRole('button', { name: 'like' }).click()
        await expect(blog.getByTestId('likes')).toContainText('1')
      })
    })
  })
})
