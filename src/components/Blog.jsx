const Blog = ( {blog} ) => {
    return (
        <div>
            <p><span>{blog.title}</span> - {blog.author}</p>
        </div>
    )
}

export default Blog