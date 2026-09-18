import { useBlog } from '../context/BlogContext';
import { Clock, Eye } from 'lucide-react';

interface FeaturedPostsProps {
  onReadArticle: (id: string) => void;
}

export default function FeaturedPosts({ onReadArticle }: FeaturedPostsProps) {
  const { articles } = useBlog();
  const featured = articles.filter(a => a.featured).slice(0, 3);
  const latestArticle = articles[0];

  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      {/* New Post Ticker */}
      {latestArticle && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-6 bg-amber-50 border border-amber-200/60 rounded-lg">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md tracking-wide uppercase" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New
          </span>
          <button
            onClick={() => onReadArticle(latestArticle.id)}
            className="text-sm font-medium text-slate-700 hover:text-amber-700 transition-colors duration-200 truncate"
            aria-label={`Read latest article: ${latestArticle.title}`}
          >
            {latestArticle.title}
          </button>
        </div>
      )}

      {/* Featured Grid */}
      <h2 id="featured-heading" className="sr-only">Featured Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((article, index) => (
          <article
            key={article.id}
            className="group relative rounded-xl overflow-hidden text-left ring-1 ring-slate-200/80 hover:ring-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
          >
            <button
              onClick={() => onReadArticle(article.id)}
              className="block w-full h-full"
              aria-label={`Read article: ${article.title}`}
            >
              {/* Background Image with CLS prevention */}
              <div className="absolute inset-0 aspect-featured">
                <img
                  src={article.coverImage}
                  alt={`Cover image for: ${article.title}`}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${
                  index === 0
                    ? 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10'
                    : index === 1
                    ? 'bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent'
                    : 'bg-gradient-to-t from-slate-900/85 via-slate-900/35 to-transparent'
                }`} aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="relative p-5 h-56 md:h-60 flex flex-col justify-end">
                <span role="tag" className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-white/90 mb-2.5 w-fit tracking-wide uppercase border border-white/10">
                  {article.category}
                </span>
                <h3 className="text-white font-semibold text-[15px] leading-snug mb-2.5 line-clamp-2 group-hover:text-amber-200 transition-colors duration-200">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-white/50 text-[11px] font-medium" aria-label={`Read time: ${article.readTime} minutes, Views: ${article.views}`}>
                  <span className="flex items-center gap-1">
                    <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
                    <span>{article.readTime} min</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} strokeWidth={1.5} aria-hidden="true" />
                    <span>{article.views}</span>
                  </span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
