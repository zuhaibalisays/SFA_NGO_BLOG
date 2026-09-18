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
    <section className="mb-8">
      {/* New Post Ticker */}
      {latestArticle && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2.5 rounded-lg mb-6 flex items-center gap-3 shadow-md">
          <span className="bg-white text-amber-600 text-xs font-bold px-2 py-0.5 rounded animate-pulse">
            NEW
          </span>
          <button
            onClick={() => onReadArticle(latestArticle.id)}
            className="text-sm font-medium hover:underline truncate"
          >
            Latest: {latestArticle.title}
          </button>
        </div>
      )}

      {/* Featured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((article, index) => (
          <button
            key={article.id}
            onClick={() => onReadArticle(article.id)}
            className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left ${
              index === 0 ? 'md:row-span-1' : ''
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 ${
                index === 0
                  ? 'bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent'
                  : index === 1
                  ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                  : 'bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-transparent'
              }`} />
            </div>

            {/* Content */}
            <div className="relative p-5 h-56 md:h-64 flex flex-col justify-end">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2 w-fit ${
                index === 0
                  ? 'bg-amber-500 text-white'
                  : index === 1
                  ? 'bg-white/20 text-white backdrop-blur-sm'
                  : 'bg-emerald-500 text-white'
              }`}>
                {article.category}
              </span>
              <h3 className="text-white font-bold text-base md:text-lg leading-snug mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span>{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {article.readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
