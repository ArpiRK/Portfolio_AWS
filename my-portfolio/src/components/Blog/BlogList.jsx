import { Link } from 'react-router-dom'
import posts from '../../content/posts'
import './Blog.css'

function BlogList() {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="blog">
      <div className="blog-inner">
        <div className="section-label">Writing</div>
        <h2 className="section-title">Blog</h2>

        {sorted.length === 0 ? (
          <p className="blog-empty">No posts yet — check back soon.</p>
        ) : (
          <div className="blog-list">
            {sorted.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                <div className="blog-date">{post.date}</div>
                <div className="blog-title">{post.title}</div>
                <p className="blog-excerpt">{post.excerpt}</p>
                <span className="blog-link">Read more →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogList
