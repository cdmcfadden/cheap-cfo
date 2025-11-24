import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  read_minutes: number;
  published_at: string;
}

interface AllBlogPostsProps {
  onPostClick: (slug: string) => void;
  onBack: () => void;
}

export default function AllBlogPosts({ onPostClick, onBack }: AllBlogPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_ai_generated', false)
      .order('published_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-amber-700 hover:text-amber-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-stone-800 mb-4">All Blog Posts</h1>
          <p className="text-xl text-stone-600">
            Insights, case studies, and advice from our CFO practice
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-stone-600">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => onPostClick(post.slug)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden text-left"
              >
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 px-6 py-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-900 bg-amber-200 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-stone-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-col space-y-2 text-xs text-stone-500 border-t border-stone-200 pt-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        <span>{formattedDate(post.published_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2" />
                        <span>{post.read_minutes} min read</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-amber-700 font-medium text-sm group-hover:text-amber-800 transition-colors flex items-center">
                    <span>Read more</span>
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
