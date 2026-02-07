import { test, expect } from '@playwright/test'
import { createBlog, likeBlog, loginWith } from './helper'

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
    await request.post('/api/users', {
      data: {
        name: 'Jane Smith',
        username: 'jsmith',
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

        await page.pause()
        await expect(page.locator('.blogDetails')).toBeVisible()

        await blog.getByRole('button', { name: 'like' }).click()
        await expect(blog.getByTestId('likes')).toContainText('1')
      })

      test('it can be deleted', async ({ page }) => {
        const blog = await page.locator('.blog')
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()
        page.once('dialog', async (dialog) => await dialog.accept())
        await blog.getByRole('button', { name: 'remove' }).click()
        await expect(page.locator('.blog')).not.toBeVisible()
      })

      test('only the blog creator can see the remove button', async ({
        page,
      }) => {
        const blog = await page.locator('.blog')
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'Log out' }).click()

        await loginWith(page, 'jsmith', 'password')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(
          blog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })

    test.describe('and several blogs exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page,'blog 1','playwright','http://localhost')
        await createBlog(page,'blog 2','playwright','http://localhost')
        await createBlog(page,'blog 3','playwright','http://localhost')

        await likeBlog(page, 'blog 2')
        await likeBlog(page, 'blog 2')
        await likeBlog(page, 'blog 2')

        await likeBlog(page, 'blog 3')
        await likeBlog(page, 'blog 3')

        await likeBlog(page, 'blog 1')
      })

      test('the blogs are ordered by the highest number of likes', async ({ page }) => {
        const blogs = page.locator('.blog')

        await expect(blogs.nth(0).getByTestId('blog 2')).toContainText('blog 2')
        await expect(blogs.nth(1).getByTestId('blog 3')).toContainText('blog 3')
        await expect(blogs.nth(2).getByTestId('blog 1')).toContainText('blog 1')
      })
    })
  })
})
