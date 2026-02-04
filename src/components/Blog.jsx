import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)
  const showWhenIsSameUser = () => {
    if (user !== undefined && blog.user) {
      if (user.name === blog.user.name) {
        return { display: '' }
      } else {
        console.log(blog.title)
        return { display: 'none' }
      }
    } else {
      return { display: 'none' }
    }
  }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blogHeader'>
        <p>
          <span>{blog.title}</span> - {blog.author}{' '}
          <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </button>
        </p>
      </div>
      <div style={showWhenVisible} className='blogDetails'>
        <p>{blog.url}</p>
        <p data-testid='likes'>
          Likes: {blog.likes}{' '}
          <button onClick={() => handleLike({ ...blog, likes: blog.likes + 1 })}>like</button>
        </p>
        <p>{blog.user ? blog.user.name : ''}</p>
        <button
          style={showWhenIsSameUser()}
          onClick={() => handleRemove(blog)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default Blog
