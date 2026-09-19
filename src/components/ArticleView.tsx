import { useEffect, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Clock, Eye, User, Calendar, ArrowLeft, Share2, Minus, Plus } from 'lucide-react';
import ShareModal from './ShareModal';

interface ArticleViewProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleView({ articleId, onBack }: ArticleViewProps) {
  const { articles, incrementViews, fontSize, increaseFontSize, decreaseFontSize } = useBlog();
  const article = articles.find(a => a.id === articleId);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (articleId) {
      incrementViews(articleId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [articleId, incrementViews]);

  if (!article) {
    return (
      <div className="text-center py-20" role="status">
        <p className="text-sm text-slate-500">Article not found.</p>
        <button onClick={onBack} className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
          ← Go Back
        </button>
      </div>
    );
  }

  // Determine if article is RTL based on language
  const isRTL = article.language === 'Balochi' || article.language === 'Urdu';
  const articleFont = article.font || 'Inter';

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
        return <h2 key={i} className="text-xl md:text-[22px] font-bold text-slate-900 mt-10 mb-4 tracking-tight">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-base font-semibold text-slate-800 mt-7 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-2 border-amber-400 bg-amber-50/50 pl-5 py-4 my-5 italic text-slate-600 rounded-r-lg text-[15px] leading-relaxed">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 text-slate-600 list-disc mb-1.5 text-[15px] leading-relaxed">
            {renderInlineFormatting(line.replace(/^[-*] /, ''))}
          </li>
        );
      }
      if (/^\d+\./.test(line)) {
        return (
          <li key={i} className="ml-4 text-slate-600 list-decimal mb-1.5 text-[15px] leading-relaxed">
            {renderInlineFormatting(line.replace(/^\d+\.\s*/, ''))}
          </li>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-8 border-slate-200" />;
      }
      if (line.startsWith('⭐') || line.startsWith('🏆')) {
        return <p key={i} className="text-[15px] my-3">{line}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-slate-600 leading-[1.8] mb-3 text-[15px]">{renderInlineFormatting(line)}</p>;
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <article aria-labelledby="article-title">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 mb-8 transition-colors duration-200 font-medium"
        aria-label="Go back to articles list"
      >
        <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
        Back to Articles
      </button>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <span role="tag" className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 tracking-wide uppercase">
            {article.category}
          </span>
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} role="tag" className="text-[10px] font-medium px-2 py-0.5 rounded-md text-slate-500 border border-slate-200">
              {tag}
            </span>
          ))}
        </div>

        <h1 id="article-title" className="text-2xl md:text-[32px] font-bold text-slate-900 leading-tight mb-5 tracking-tight">
          {article.title}
        </h1>

        <p className="text-base md:text-[17px] text-slate-500 mb-7 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500 border-t border-b border-slate-100 py-4 font-medium">
          <span className="flex items-center gap-1.5">
            <User size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
            <span>{article.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
            <span>{article.readTime} min read</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={13} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
            <span>{article.views} views</span>
          </span>
          <button 
            onClick={() => setShareModalOpen(true)}
            className="ml-auto flex items-center gap-1.5 text-slate-400 hover:text-amber-600 transition-colors duration-200" 
            aria-label="Share this article"
          >
            <Share2 size={13} strokeWidth={1.5} aria-hidden="true" />
            Share
          </button>
        </div>
      </header>

      {/* Cover Image with CLS prevention */}
      <div className="rounded-xl overflow-hidden mb-10 ring-1 ring-slate-200/60">
        <div className="aspect-featured">
          <img
            src={article.coverImage}
            alt={`Cover image for: ${article.title}`}
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Font Size Controls */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">Font Size:</span>
        <button
          onClick={decreaseFontSize}
          disabled={fontSize <= 12}
          className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease font size"
        >
          <Minus size={16} />
        </button>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[3rem] text-center">
          {fontSize}px
        </span>
        <button
          onClick={increaseFontSize}
          disabled={fontSize >= 24}
          className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase font size"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Article Content */}
      <div
        className="prose-custom"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          fontFamily: articleFont,
          textAlign: isRTL ? 'right' : 'left',
          lineHeight: isRTL ? '2' : '1.8',
          fontSize: `${fontSize}px`,
        }}
      >
        {renderContent(article.content)}
      </div>

      {/* Article Footer */}
      <footer className="mt-14 pt-8 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-[12px] font-medium text-slate-500 mr-1">Tags:</span>
          {article.tags.map(tag => (
            <span key={tag} role="tag" className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200 text-slate-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="bg-slate-50 rounded-xl p-5 ring-1 ring-slate-100">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Written by {article.author}</strong> — Published as part of SFA Daily Articles,
            a student publishing initiative by the School-for-All Welfare Organization in Turbat, Balochistan.
          </p>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        articleTitle={article.title}
        articleAuthor={article.author}
        articleUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </article>
  );
}
