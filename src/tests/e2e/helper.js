import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByText('Log in').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByTestId(title)).toBeVisible()
}

const likeBlog = async (page, title) => {
  const blog = await page.getByTestId(title)
  await expect(blog).toBeVisible()
  const blogSection = blog.locator('..')

  await blogSection.getByRole('button', { name: 'view' }).click()

  const likesContainer = blogSection.getByTestId('likes')
  const initialLikes = await likesContainer.innerText()

  const likeButton = blogSection.getByRole('button', { name: 'like' })
  await expect(likeButton).toBeVisible()
  await likeButton.click()

  await expect(likesContainer).not.toHaveText(initialLikes)

  blogSection.getByRole('button', { name: 'hide' }).click()
  await expect(blogSection.getByRole('button', { name: 'view' })).toBeVisible()
}

export { loginWith, createBlog, likeBlog }
