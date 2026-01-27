import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('Component <Blog />', () => {
  let container
  const blog = {
    title: 'Testing frontend with react-testing-library',
    author: 'React.js',
    url: 'http://localhost:3001/',
    likes: 0,
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders content', async () => {
    const header = container.querySelector('.blogHeader')
    expect(header).toHaveTextContent(
      'Testing frontend with react-testing-library'
    )
    expect(header).toHaveTextContent('React.js')

    const details = container.querySelector('.blogDetails')
    expect(details).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')

    expect(div).toHaveTextContent('http://localhost:3001/')
    expect(div).toHaveTextContent(0)
  })
})
