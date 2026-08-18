// Blog posts, MVP storage: plain JS objects with markdown bodies.
// Rendered with react-markdown. Swap this for real .md files or an
// S3/Lambda-backed API later without changing the components below —
// they only depend on the shape { slug, title, date, excerpt, body }.

const posts = [
  {
    slug: 'hello-world',
    title: 'Hello, World',
    date: '2026-08-10',
    excerpt: "Kicking off a blog to write about what I'm building and learning.",
    body: `# Hello, World

This is the first post on my new blog. I'm using it to write about projects,
things I'm learning, and notes from building out this portfolio site on AWS.

More soon.`,
  },
]

export default posts
