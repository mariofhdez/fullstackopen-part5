import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(res => {
      setBlogs(res)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
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

  const loginForm = () => (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': "15px" }}>
          <p>Username</p>
          <input
            style={{ 'height': '20px' }}
            type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': "15px" }}>
          <p>Password</p>
          <input
            style={{ 'height': '20px' }}
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
          <h2>Blog list</h2>
          {blogs.map(b => <Blog key={b.id} blog={b} />)}
        </div>
      }
    </>
  )
}

export default App
