import { useBlog } from '../context/BlogContext';
import { Eye, Clock } from 'lucide-react';

interface SidebarProps {
  onReadArticle: (id: string) => void;
  onContact: () => void;
}

const tags = ['Articles', 'Book Reviews', 'Letters', 'Motivational', 'Social Issues', 'Stories', 'Weekly Reports'];

export default function Sidebar({ onReadArticle, onContact }: SidebarProps) {
  const { articles, setActiveCategory } = useBlog();
  const popularPosts = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

  const months = Array.from(new Set(articles.map(a => {
    const d = new Date(a.date);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))).slice(0, 6);

  return (
    <aside className="space-y-5">
      {/* Follow Us */}
      <div className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" />
          Follow Us
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: 'fab fa-facebook-f', label: 'Facebook', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200/50' },
            { icon: 'fab fa-twitter', label: 'Twitter', color: 'bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200/50' },
            { icon: 'fab fa-youtube', label: 'YouTube', color: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200/50' },
            { icon: 'fab fa-instagram', label: 'Instagram', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-200/50' },
          ].map(social => (
            <a
              key={social.label}
              href="#"
              className={`${social.color} border text-[11px] font-medium py-2 px-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-200`}
            >
              <i className={social.icon}></i>
              {social.label}
            </a>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" />
          Popular Posts
        </h3>
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => onReadArticle(post.id)}
              className="flex gap-3 w-full text-left group"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 ring-1 ring-slate-200/60">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-icon w-full h-full flex items-center justify-center';
                      fallback.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-amber-600 tracking-wide">
                  #{index + 1}
                </span>
                <h4 className="text-[12px] font-medium text-slate-700 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors duration-200 mt-0.5">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-1 font-medium">
                  <span className="flex items-center gap-1"><Eye size={10} strokeWidth={1.5} />{post.views}</span>
                  <span className="flex items-center gap-1"><Clock size={10} strokeWidth={1.5} />{post.readTime}m</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Archives */}
      <div className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h3 className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" />
          Archives
        </h3>
        <ul className="space-y-1">
          {months.map(month => (
            <li key={month}>
              <span className="text-[12px] text-slate-500 hover:text-amber-700 cursor-pointer transition-colors duration-200 flex items-center gap-2 py-1 font-medium">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                {month}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 ring-1 ring-slate-700/50">
        <h3 className="text-[13px] font-semibold text-white mb-1.5 flex items-center gap-2">
          <i className="fas fa-envelope text-amber-400 text-[11px]"></i>
          Share Your Voice
        </h3>
        <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">
          Have a story to share or want to contribute? We'd love to hear from you.
        </p>
        <button
          onClick={onContact}
          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[12px] font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-amber-500/20"
        >
          Contact Us
        </button>
      </div>
    </aside>
  );
}
