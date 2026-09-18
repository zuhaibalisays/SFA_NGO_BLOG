import { useBlog } from '../context/BlogContext';
import { Eye, Clock } from 'lucide-react';

interface SidebarProps {
  onReadArticle: (id: string) => void;
  onContact: () => void;
}

const tags = ['Articles', 'Book Reviews', 'Letters', 'Motivational', 'Social Issues', 'Story', 'Weekly Report'];

export default function Sidebar({ onReadArticle, onContact }: SidebarProps) {
  const { articles, setActiveCategory } = useBlog();
  const popularPosts = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

  const months = Array.from(new Set(articles.map(a => {
    const d = new Date(a.date);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))).slice(0, 6);

  return (
    <aside className="space-y-6">
      {/* Follow Us */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Follow Us
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: 'fab fa-facebook-f', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
            { icon: 'fab fa-twitter', label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
            { icon: 'fab fa-youtube', label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
            { icon: 'fab fa-instagram', label: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
          ].map(social => (
            <a
              key={social.label}
              href="#"
              className={`${social.color} text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors`}
            >
              <i className={social.icon}></i>
              {social.label}
            </a>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Popular Posts
        </h3>
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => onReadArticle(post.id)}
              className="flex gap-3 w-full text-left group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  #{index + 1} Trending
                </span>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-0.5"><Eye size={10} />{post.views}</span>
                  <span className="flex items-center gap-0.5"><Clock size={10} />{post.readTime}m</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags / Labels */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Tags / Labels
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag === 'Book Reviews' ? 'Book Review' : tag === 'Social Issues' ? 'Social Issue' : tag)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Archives */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
          Monthly Archives
        </h3>
        <ul className="space-y-1.5">
          {months.map(month => (
            <li key={month}>
              <span className="text-sm text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-2">
                <i className="fas fa-chevron-right text-[8px] text-amber-500"></i>
                {month}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact / Feedback CTA */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-5 shadow-sm text-white">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <i className="fas fa-envelope text-amber-400"></i>
          Share Your Voice
        </h3>
        <p className="text-sm text-white/70 mb-3">
          Have a story to share? Want to contribute? Send us a message!
        </p>
        <button
          onClick={onContact}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Contact Us
        </button>
      </div>
    </aside>
  );
}
