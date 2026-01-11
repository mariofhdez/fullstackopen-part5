import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = async () => {
    const blogs = await axios.get(baseUrl)
    return blogs.data
}

export default {
    getAll
}