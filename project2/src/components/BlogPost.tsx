import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  read_minutes: number;
  published_at: string;
}

interface BlogPostProps {
  slug: string;
  onBack: () => void;
}

export default function BlogPost({ slug, onBack }: BlogPostProps) {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-stone-500">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center text-amber-700 hover:text-amber-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h1 className="text-2xl font-bold text-stone-800 mb-4">Article Not Found</h1>
            <p className="text-stone-600">The article you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-amber-700 hover:text-amber-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 px-8 py-12">
            <div className="flex items-center space-x-3 mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-900 bg-amber-200 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex items-center space-x-6 text-amber-100">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{post.read_minutes} min read</span>
              </div>
            </div>
          </div>

          <div className="px-8 py-12">
            <div className="prose prose-lg prose-stone max-w-none
                prose-headings:text-stone-800 prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-8
                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-8 prose-h2:border-b prose-h2:border-amber-200 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                prose-p:text-stone-700 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-stone-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-li:text-stone-700 prose-li:mb-2
                prose-code:text-amber-700 prose-code:bg-amber-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-stone-800 prose-pre:text-stone-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-a:text-amber-700 prose-a:no-underline hover:prose-a:text-amber-800 hover:prose-a:underline">
              {post.content.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return <h1 key={idx}>{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={idx}>{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={idx}>{line.substring(4)}</h3>;
                } else if (line.startsWith('```')) {
                  return null;
                } else if (line.startsWith('- ')) {
                  return <li key={idx}>{line.substring(2)}</li>;
                } else if (line.trim() === '') {
                  return <br key={idx} />;
                } else if (line.includes('**')) {
                  const parts = line.split('**');
                  return (
                    <p key={idx}>
                      {parts.map((part, i) =>
                        i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                      )}
                    </p>
                  );
                } else {
                  return <p key={idx}>{line}</p>;
                }
              })}
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
