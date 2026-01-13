import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }
    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle}>
            <div>
                <p><span>{blog.title}</span> - {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button></p>
            </div>
            <div style={showWhenVisible}>
                <p>{blog.url}</p>
                <p>Likes: {blog.likes} <button onClick={(e) =>handleLike(blog)}>like</button></p>
                <p>{blog.user ? blog.user.name : ''}</p>
            </div>
        </div>
    )
}

export default Blog