import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Clock, Eye, User, ArrowRight } from 'lucide-react';

interface BlogFeedProps {
  onReadArticle: (id: string) => void;
}

const categories = ['All', 'Articles', 'Book Review', 'Letter', 'Social Issue', 'Story', 'Weekly Report', 'Motivational'];

export default function BlogFeed({ onReadArticle }: BlogFeedProps) {
  const { filteredArticles, activeCategory, setActiveCategory, searchQuery } = useBlog();
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Articles'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#0F172A] dark:bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {displayedArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-slate-500 dark:text-slate-400">No articles found. Try a different category or search term.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayedArticles.map(article => (
            <article
              key={article.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 group"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-48 md:w-56 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400">{article.date}</span>
                    </div>
                    <h3
                      className="text-base md:text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer"
                      onClick={() => onReadArticle(article.id)}
                    >
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {article.views}
                      </span>
                    </div>
                    <button
                      onClick={() => onReadArticle(article.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                    >
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2.5 bg-[#0F172A] dark:bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-[#1E293B] dark:hover:bg-amber-600 transition-colors shadow-md"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
