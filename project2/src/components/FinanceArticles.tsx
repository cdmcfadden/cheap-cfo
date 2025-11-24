import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, DollarSign, BarChart3, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  read_minutes: number;
}

const categories = [
  { name: "All", icon: BookOpen, color: "from-stone-600 to-stone-700" },
  { name: "Cash Management", icon: DollarSign, color: "from-amber-600 to-orange-600" },
  { name: "Financial Metrics", icon: BarChart3, color: "from-amber-500 to-amber-600" },
  { name: "Financial Analysis", icon: Calculator, color: "from-orange-500 to-amber-600" },
  { name: "Planning & Analysis", icon: TrendingUp, color: "from-amber-700 to-orange-700" }
];

interface FinanceArticlesProps {
  onArticleClick: (slug: string) => void;
}

export default function FinanceArticles({ onArticleClick }: FinanceArticlesProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isExpanded, setIsExpanded] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIArticles();
  }, []);

  const loadAIArticles = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_ai_generated', true)
      .order('published_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="mt-12 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
      <div
        className="bg-gradient-to-r from-stone-700 to-stone-800 px-8 py-6 cursor-pointer hover:from-stone-800 hover:to-stone-900 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              CFO Knowledge Library
            </h2>
            <p className="text-amber-100 text-sm">
              {articles.length} essential articles to master business finance
            </p>
          </div>
          <button className="text-white hover:scale-110 transition-transform">
            {isExpanded ? <ChevronUp className="w-8 h-8" /> : <ChevronDown className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.name}</span>
                  {category.name === "All" && (
                    <span className="text-xs opacity-75">({articles.length})</span>
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-12 text-stone-500">Loading articles...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => {
                  const categoryData = categories.find(c => c.name === article.category) || categories[0];
                  const Icon = categoryData.icon;

                  return (
                    <button
                      key={article.id}
                      onClick={() => onArticleClick(article.slug)}
                      className="group bg-amber-50 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-amber-200 hover:border-amber-300 text-left w-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryData.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-stone-600 font-medium">
                          {article.read_minutes} min
                        </span>
                      </div>

                      <h3 className="font-bold text-stone-800 mb-2 group-hover:text-stone-900 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-sm text-stone-600 line-clamp-3 mb-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold bg-gradient-to-r ${categoryData.color} bg-clip-text text-transparent`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">
                          Read article →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-stone-500">No articles found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
