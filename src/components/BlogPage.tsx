import type React from "react"
import { Link } from "react-router-dom"

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Tips for First-Time Car Renters",
      excerpt: "Everything you need to know before renting your first car through Air Drive.",
      date: "2024-01-15",
      author: "Sarah Johnson",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Maximizing Your Earnings as a Car Owner",
      excerpt: "Learn how to optimize your car listing and increase your rental income.",
      date: "2024-01-10",
      author: "Mike Chen",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "The Future of Car Sharing",
      excerpt: "How peer-to-peer car sharing is changing urban transportation.",
      date: "2024-01-05",
      author: "Emily Davis",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Air Drive Blog</h1>
          <p className="text-xl text-gray-600 mb-12">
            Stay updated with the latest news, tips, and insights from the car sharing world.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-amber-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
