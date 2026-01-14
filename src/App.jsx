import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blog'
import loginService from './services/login'

import './index.css'

function App() {
  const blogFormRef = useRef()
  const [message, setMessage] = useState({
    message: null,
    type: null,
  })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogsToShow = (blogs) => {
    const sortedBlogList = blogs.sort((a, b) => {
      if (a.likes > b.likes) return -1
      if (a.likes < b.likes) return 1
      else return 0
    })
    setBlogs(sortedBlogList)
  }

  useEffect(() => {
    blogService.getAll().then((res) => {
      blogsToShow(res)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setMessage({
        message: 'Wrong username or password',
        type: 'error',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      window.localStorage.clear()

      setUser(null)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Error', error.message)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      blogsToShow(blogs.concat(savedBlog))
      blogFormRef.current.toggleVisibility()

      setMessage({
        message: `a new blog ${blogObject.title} by ${blogObject.author} was added`,
        type: 'success',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    } catch (error) {
      console.log(error)
      setMessage({
        message: `The blog ${blogObject.title} by ${blogObject.author} was not added`,
        type: 'error',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    try {
      const blogObject = { ...blog, likes: blog.likes + 1 }
      const updatedBlog = await blogService.update(blogObject)
      const blogList = blogs.map((b) =>
        b.id === updatedBlog.id ? updatedBlog : b
      )
      blogsToShow(blogList)

      setMessage({
        message: `You liked '${blogObject.title}' by ${blogObject.author}`,
        type: 'success',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    } catch (error) {
      console.log(error)
      setMessage({
        message: `Like to the blog ${blog.title} is not registered`,
        type: 'error',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (!confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
        throw new Error()
      } else {
        await blogService.remove(blog.id)
        const blogList = blogs.filter((b) => b.id !== blog.id)
        blogsToShow(blogList)

        setMessage({
          message: 'The deletion was completed successfully',
          type: 'success',
        })
        setTimeout(() => {
          setMessage({
            message: null,
            type: null,
          })
        }, 5000)
      }
    } catch (error) {
      console.log(error)
      setMessage({
        message: 'The blog delete process is not completed',
        type: 'error',
      })
      setTimeout(() => {
        setMessage({
          message: null,
          type: null,
        })
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="textField">
          <p>Username</p>
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="textField">
          <p>Password</p>
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )

  const blogForm = () => {
    return (
      <Togglable buttonLabel="Create new note" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  return (
    <>
      <h1>Blog App</h1>
      <Notification message={message.message} type={message.type} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <div>
            <p>{user.name}</p>
            <button onClick={handleLogout}>Log out</button>
          </div>
          {blogForm()}
          <h2>Blog list</h2>
          {blogs.map((b) => (
            <Blog
              key={b.id}
              blog={b}
              handleLike={likeBlog}
              handleRemove={deleteBlog}
              user={user}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default App
