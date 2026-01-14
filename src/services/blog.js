import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const blogs = await axios.get(baseUrl)
  return blogs.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  if (response.status === 201) {
    return response.data
  } else {
    console.log(response.data)
    return null
  }
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  if (response.status === 204) {
    return response.data
  } else {
    console.log(response.data)
    return null
  }
}

const update = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  if (response.status === 200) {
    return response.data
  } else {
    console.log(response.data)
    return null
  }
}

export default {
  getAll,
  create,
  remove,
  update,
  setToken,
}
