import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Clock, Eye, User, ArrowRight } from 'lucide-react';
import { allCategories } from '../config/navigation';

interface BlogFeedProps {
  onReadArticle: (id: string) => void;
}

export default function BlogFeed({ onReadArticle }: BlogFeedProps) {
  const { filteredArticles, activeCategory, setActiveCategory, searchQuery } = useBlog();
  const [visibleCount, setVisibleCount] = useState(6);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <section aria-labelledby="browse-heading">
      {/* Category Filter Tabs */}
      <div className="mb-8">
        <h2 id="browse-heading" className="text-base font-semibold text-slate-800 mb-3.5 flex items-center gap-2.5">
          <span className="w-0.5 h-4 bg-amber-500 rounded-full" aria-hidden="true" />
          {searchQuery ? `Results for "${searchQuery}"` : 'Browse Articles'}
        </h2>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter articles by category">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium tracking-wide transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm'
              }`}
              aria-pressed={activeCategory === cat}
              aria-label={`Filter by ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      {displayedArticles.length === 0 ? (
        <div className="text-center py-16" role="status">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center" aria-hidden="true">
            <span className="text-lg">📝</span>
          </div>
          <p className="text-sm text-slate-500">No articles found. Try a different category or search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md ring-1 ring-slate-100 hover:ring-slate-200 transition-all duration-200 overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail with CLS prevention */}
                <div className="sm:w-44 md:w-52 flex-shrink-0 overflow-hidden">
                  <div className="aspect-card">
                    <img
                      src={article.coverImage}
                      alt={`Cover image for: ${article.title}`}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" fill="%23f1f5f9"><rect width="400" height="225"/><text x="200" y="112" text-anchor="middle" fill="%2394a3b8" font-size="14">Image unavailable</text></svg>');
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span role="tag" className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 tracking-wide uppercase">
                        {article.category}
                      </span>
                      <time dateTime={article.date} className="text-[11px] text-slate-500 font-medium">
                        {article.date}
                      </time>
                    </div>
                    <h3
                      className="text-[15px] font-semibold text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors duration-200 cursor-pointer"
                      onClick={() => onReadArticle(article.id)}
                    >
                      {article.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3.5 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <User size={12} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
                        <span>{article.author}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
                        <span>{article.readTime} min</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={12} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
                        <span>{article.views}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => onReadArticle(article.id)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                      aria-label={`Read article: ${article.title}`}
                    >
                      Read <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
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
            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium text-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
            aria-label="Load more articles"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
