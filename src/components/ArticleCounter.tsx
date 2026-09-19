import { useBlog } from '../context/BlogContext';
import { FileText, Eye, Users, BookOpen } from 'lucide-react';

export default function ArticleCounter() {
  const { articles } = useBlog();

  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalAuthors = new Set(articles.map(a => a.author)).size;
  const totalCategories = new Set(articles.map(a => a.category)).size;

  const stats = [
    { icon: <FileText size={20} className="text-amber-500" aria-hidden="true" />, value: totalArticles, label: 'Articles Published', ariaLabel: `${totalArticles} articles published` },
    { icon: <Eye size={20} className="text-amber-500" aria-hidden="true" />, value: totalViews, label: 'Total Views', ariaLabel: `${totalViews} total views` },
    { icon: <Users size={20} className="text-amber-500" aria-hidden="true" />, value: totalAuthors, label: 'Student Writers', ariaLabel: `${totalAuthors} student writers` },
    { icon: <BookOpen size={20} className="text-amber-500" aria-hidden="true" />, value: totalCategories, label: 'Categories', ariaLabel: `${totalCategories} categories` },
  ];

  return (
    <section aria-labelledby="stats-heading" className="mt-10 mb-10">
      <h2 id="stats-heading" className="sr-only">Article Statistics</h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl ring-1 ring-slate-100 dark:ring-slate-700 shadow-sm p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 ring-1 ring-slate-100 dark:ring-slate-600" aria-label={stat.ariaLabel}>
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-200/50 dark:ring-amber-500/20">
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{stat.value.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
