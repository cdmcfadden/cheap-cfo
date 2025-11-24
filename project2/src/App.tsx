import { useState } from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';
import CallInterface from './components/CallInterface';
import ConversationHistory from './components/ConversationHistory';
import RecentBlogPosts from './components/RecentBlogPosts';
import FinanceArticles from './components/FinanceArticles';
import BlogPost from './components/BlogPost';
import AllBlogPosts from './components/AllBlogPosts';

type ViewType = 'home' | 'blog' | 'blog-list';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string>('');

  const handlePostClick = (slug: string) => {
    setCurrentBlogSlug(slug);
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllClick = () => {
    setCurrentView('blog-list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentBlogSlug('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'blog' && currentBlogSlug) {
    return <BlogPost slug={currentBlogSlug} onBack={handleBackToHome} />;
  }

  if (currentView === 'blog-list') {
    return <AllBlogPosts onPostClick={handlePostClick} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
      <div
        className="relative w-full h-96 bg-cover bg-center mb-12 shadow-2xl"
        style={{ backgroundImage: "url('/cheap-cfo background pic 1.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-800/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-4 rounded-2xl shadow-xl">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Cheap Financial Officer
              </h1>
              <p className="text-2xl text-amber-100 mb-3">
                Your AI-Powered CFO Tutor
              </p>
              <div className="flex items-center space-x-2 text-amber-200">
                <TrendingUp className="w-5 h-5" />
                <p className="text-base">
                  Master Cash Flow, EBITDA, Investments & More
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        <main className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl p-8 lg:p-12 border border-amber-200">
              <CallInterface
                sessionId={sessionId}
                onSessionStart={setSessionId}
                onSessionEnd={() => setSessionId(null)}
              />
            </div>

            <div className="lg:sticky lg:top-8">
              <ConversationHistory sessionId={sessionId} />
            </div>
          </div>

          <RecentBlogPosts onPostClick={handlePostClick} onViewAllClick={handleViewAllClick} />

          <div className="articles-section">
            <FinanceArticles onArticleClick={handlePostClick} />
          </div>
        </main>

        <footer className="text-center mt-12 text-stone-600 text-sm pb-8">
          <p>cheapfinancialofficer.com - Empowering Future CFOs</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
