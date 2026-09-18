import { useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Clock, Eye, User, Calendar, ArrowLeft, Share2 } from 'lucide-react';

interface ArticleViewProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleView({ articleId, onBack }: ArticleViewProps) {
  const { articles, incrementViews } = useBlog();
  const article = articles.find(a => a.id === articleId);

  useEffect(() => {
    if (articleId) {
      incrementViews(articleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [articleId, incrementViews]);

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">Article not found.</p>
        <button onClick={onBack} className="mt-4 text-amber-600 hover:underline">
          ← Go Back
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-500/10 pl-4 py-3 my-4 italic text-slate-700 dark:text-slate-300 rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 text-slate-600 dark:text-slate-300 list-disc mb-1">
            {renderInlineFormatting(line.replace(/^[-*] /, ''))}
          </li>
        );
      }
      if (/^\d+\./.test(line)) {
        return (
          <li key={i} className="ml-4 text-slate-600 dark:text-slate-300 list-decimal mb-1">
            {renderInlineFormatting(line.replace(/^\d+\.\s*/, ''))}
          </li>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-6 border-slate-200 dark:border-slate-700" />;
      }
      if (line.startsWith('⭐')) {
        return <p key={i} className="text-lg my-2">{line}</p>;
      }
      if (line.startsWith('🏆')) {
        return <p key={i} className="text-lg my-2">{line}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{renderInlineFormatting(line)}</p>;
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-800 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Articles
      </button>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
            {article.category}
          </span>
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4 font-serif">
          {article.title}
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-700 py-4">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-amber-500" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-amber-500" />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-amber-500" />
            {article.readTime} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-amber-500" />
            {article.views} views
          </span>
          <button className="ml-auto flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </header>

      {/* Cover Image */}
      <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="prose-custom">
        {renderContent(article.content)}
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags:</span>
          {article.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <strong>Written by {article.author}</strong> — This article was published as part of SFA Daily Articles, 
            a student publishing initiative by the School-for-All Welfare Organization in Turbat, Balochistan.
          </p>
        </div>
      </footer>
    </article>
  );
}
