import { X, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  articleAuthor: string;
  articleUrl: string;
}

export default function ShareModal({ isOpen, onClose, articleTitle, articleAuthor, articleUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareText = `${articleTitle} by ${articleAuthor} - SFA Daily Articles`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://raw.githubusercontent.com/zuhaibalisays/SFA_NGO_BLOG/main/SFA%20Logo.png"
                alt="SFA Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 id="share-modal-title" className="text-lg font-bold text-white">Share Article</h2>
                <p className="text-[12px] text-slate-300">SFA Daily Articles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close share dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Info */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg ring-1 ring-slate-100">
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide mb-1">Article</p>
            <h3 className="text-[15px] font-semibold text-slate-800 leading-snug mb-2 line-clamp-2">
              {articleTitle}
            </h3>
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
              <span className="font-medium">By {articleAuthor}</span>
            </p>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <p className="text-[13px] font-medium text-slate-700">Share via</p>
            
            {/* Social Media Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {shareLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white rounded-lg py-3 px-4 flex flex-col items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md`}
                    aria-label={`Share on ${link.name}`}
                  >
                    <Icon size={20} />
                    <span className="text-[11px] font-medium">{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 font-medium text-[13px]"
                aria-label="Copy article link"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-emerald-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link size={16} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
