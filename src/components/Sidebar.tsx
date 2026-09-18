import { useBlog } from '../context/BlogContext';
import { Eye, Clock } from 'lucide-react';
import { sidebarTags, socialLinks } from '../config/navigation';

interface SidebarProps {
  onReadArticle: (id: string) => void;
  onContact: () => void;
}

export default function Sidebar({ onReadArticle, onContact }: SidebarProps) {
  const { articles, setActiveCategory } = useBlog();
  const popularPosts = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

  const months = Array.from(new Set(articles.map(a => {
    const d = new Date(a.date);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))).slice(0, 6);

  return (
    <aside aria-label="Sidebar" className="space-y-5">
      {/* Follow Us */}
      <section aria-labelledby="follow-heading" className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h2 id="follow-heading" className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" aria-hidden="true" />
          Follow Us
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {socialLinks.map(social => (
            <a
              key={social.label}
              href={social.href}
              className={`${social.label === 'Facebook' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200/50' :
                social.label === 'Twitter' ? 'bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200/50' :
                social.label === 'YouTube' ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200/50' :
                'bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-200/50'
              } border text-[11px] font-medium py-2 px-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-200`}
              aria-label={social.ariaLabel}
            >
              <i className={social.icon} aria-hidden="true"></i>
              {social.label}
            </a>
          ))}
        </div>
      </section>

      {/* Popular Posts */}
      <section aria-labelledby="popular-heading" className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h2 id="popular-heading" className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" aria-hidden="true" />
          Popular Posts
        </h2>
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => onReadArticle(post.id)}
              className="flex gap-3 w-full text-left group"
              aria-label={`Read popular article: ${post.title}`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 ring-1 ring-slate-200/60">
                <div className="aspect-square-thumb">
                  <img
                    src={post.coverImage}
                    alt={`Thumbnail for: ${post.title}`}
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
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
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-amber-600 tracking-wide" aria-hidden="true">
                  #{index + 1}
                </span>
                <h3 className="text-[12px] font-medium text-slate-700 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors duration-200 mt-0.5">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-1 font-medium" aria-label={`${post.views} views, ${post.readTime} minutes read time`}>
                  <span className="flex items-center gap-1"><Eye size={10} strokeWidth={1.5} aria-hidden="true" />{post.views}</span>
                  <span className="flex items-center gap-1"><Clock size={10} strokeWidth={1.5} aria-hidden="true" />{post.readTime}m</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section aria-labelledby="tags-heading" className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h2 id="tags-heading" className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" aria-hidden="true" />
          Tags
        </h2>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by tag">
          {sidebarTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200"
              aria-label={`Filter by ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Monthly Archives */}
      <section aria-labelledby="archives-heading" className="bg-white rounded-xl p-5 ring-1 ring-slate-100">
        <h2 id="archives-heading" className="text-[13px] font-semibold text-slate-800 mb-3.5 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full" aria-hidden="true" />
          Archives
        </h2>
        <ul className="space-y-1">
          {months.map(month => (
            <li key={month}>
              <span className="text-[12px] text-slate-500 hover:text-amber-700 cursor-pointer transition-colors duration-200 flex items-center gap-2 py-1 font-medium">
                <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
                {month}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact CTA */}
      <section aria-labelledby="contact-cta-heading" className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 ring-1 ring-slate-700/50">
        <h2 id="contact-cta-heading" className="text-[13px] font-semibold text-white mb-1.5 flex items-center gap-2">
          <i className="fas fa-envelope text-amber-400 text-[11px]" aria-hidden="true"></i>
          Share Your Voice
        </h2>
        <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">
          Have a story to share or want to contribute? We'd love to hear from you.
        </p>
        <button
          onClick={onContact}
          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[12px] font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-amber-500/20"
          aria-label="Open contact form"
        >
          Contact Us
        </button>
      </section>
    </aside>
  );
}
