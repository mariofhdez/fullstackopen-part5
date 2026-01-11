import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'
import './index.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(res => {
      setBlogs(res)
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
      console.log(user);
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Error', error.message);
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
      console.error('Error', error.message);
    }
  }

  const addBlog = async (e) => {
    e.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    const savedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(savedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const loginForm = () => (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='textField'>
          <p>Username</p>
          <input
            type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className='textField'>
          <p>Password</p>
          <input
            type="password"
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div className='textField'>
          <p>Title:</p>
          <input
            type="text"
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className='textField'>
          <p>Author:</p>
          <input
            type="text"
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className='textField'>
          <p>URL:</p>
          <input
            type="text"
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>

      </form>
    </>
  )

  return (
    <>
      <h1>Blog App</h1>
      {user === null ?
        loginForm() :
        <div>
          <div>
            <p>{user.name}</p>
            <button onClick={handleLogout}>Log out</button>
          </div>
          {blogForm()}
          <h2>Blog list</h2>
          {blogs.map(b => <Blog key={b.id} blog={b} />)}
        </div>
      }
    </>
  )
}

export default App
