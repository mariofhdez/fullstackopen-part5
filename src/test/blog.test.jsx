import { render } from '@testing-library/react'
import Blog from '../components/Blog'

describe('Component <Blog />', () => {
  let container
  const blog = {
    title: 'Testing frontend with react-testing-library',
    author: 'React.js',
    url: 'http://localhost:3001/',
    likes: 25,
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders content', async () => {
    const header = container.querySelector('.blogHeader')
    expect(header).toHaveTextContent('Testing frontend with react-testing-library')
    expect(header).toHaveTextContent('React.js')

    const details = container.querySelector('.blogDetails')
    expect(details).toHaveTextContent('http://localhost:3001/')
    expect(details).toHaveTextContent(25)

    expect(details).toHaveStyle('display: none')
  })
})