import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import posts from '../../content/posts'
import './Blog.css'

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="blog">
        <div className="blog-inner">
          <p className="blog-empty">Post not found.</p>
          <Link to="/blog" className="blog-link">← Back to blog</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="blog">
      <div className="blog-inner blog-post-inner">
        <Link to="/blog" className="blog-back">← Back to blog</Link>
        <div className="blog-date">{post.date}</div>
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-body">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}

export default BlogPost
