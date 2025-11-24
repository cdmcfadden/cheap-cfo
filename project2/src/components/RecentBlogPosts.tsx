import { useEffect, useState } from 'react';
import { ExternalLink, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  url: string;
  published_at: string;
  category: string;
  read_time: string;
  read_minutes?: number;
}

interface RecentBlogPostsProps {
  onPostClick: (slug: string) => void;
  onViewAllClick: () => void;
}

export default function RecentBlogPosts({ onPostClick, onViewAllClick }: RecentBlogPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_ai_generated', false)
      .order('published_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="mt-12 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-8 border border-amber-200">
        <div className="text-center text-stone-500">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-8 border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-stone-800 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-amber-600" />
          Latest from the Blog
        </h2>
        <button
          onClick={onViewAllClick}
          className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center space-x-1 transition-colors"
        >
          <span>View all posts</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onPostClick(post.slug)}
            className="group block p-6 rounded-xl bg-amber-50 hover:bg-white border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 text-left w-full"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-800 bg-amber-200 rounded-full">
                {post.category}
              </span>
              <div className="flex items-center text-xs text-stone-500">
                <Clock className="w-3 h-3 mr-1" />
                {post.read_minutes ? `${post.read_minutes} min` : post.read_time}
              </div>
            </div>

            <h3 className="font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-stone-600 line-clamp-3 mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center text-xs text-amber-700 font-medium group-hover:text-amber-800 transition-colors">
              <span>Read article</span>
              <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-8 text-stone-500">
          No blog posts available yet. Check back soon!
        </div>
      )}
    </div>
  );
}
