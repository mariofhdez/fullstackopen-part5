import { useState } from "react"

const BlogForm = ({ createBlog }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (e) => {
        e.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Create a new blog</h2>
            <form onSubmit={addBlog}>
                <div className='textField'>
                    <p>Title:</p>
                    <input
                        type="text"
                        value={title}
                        name='Title'
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div className='textField'>
                    <p>Author:</p>
                    <input
                        type="text"
                        value={author}
                        name='Author'
                        onChange={event => setAuthor(event.target.value)}
                    />
                </div>
                <div className='textField'>
                    <p>URL:</p>
                    <input
                        type="text"
                        value={url}
                        name='Url'
                        onChange={event => setUrl(event.target.value)}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default BlogForm