const Blog = ( {blog} ) => {
    return (
        <div>
            <p>Title: <span>{blog.title}</span></p>
            <p>Author: {blog.author}</p>
        </div>
    )
}

export default Blog