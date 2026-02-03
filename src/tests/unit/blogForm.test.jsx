import { render, screen } from '@testing-library/react'
import BlogForm from '../../components/BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> creates a blog and calls onSubmit', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={addBlog} />)

  const titleBox = screen.getByPlaceholderText('Title')
  const auhtorBox = screen.getByPlaceholderText('Author')
  const urlBox = screen.getByPlaceholderText('Url')
  const submitButton = screen.getByText('Save')

  await user.type(titleBox, 'testing blogform ...')
  await user.type(auhtorBox, 'John Doe')
  await user.type(urlBox, 'http://localhost:3000/')

  await user.click(submitButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing blogform ...')
  expect(addBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(addBlog.mock.calls[0][0].url).toBe('http://localhost:3000/')
})
