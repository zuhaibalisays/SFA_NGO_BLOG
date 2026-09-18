import { useState, useEffect, useRef } from 'react';
import { useBlog } from '../context/BlogContext';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { addContact } = useBlog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContact({ name, email, message });
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden ring-1 ring-slate-200/60"
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 id="contact-modal-title" className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Send size={15} className="text-amber-500" aria-hidden="true" />
            Contact Us
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            aria-label="Close contact form"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-8" role="status">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center" aria-hidden="true">
                <span className="text-xl">✓</span>
              </div>
              <h3 className="text-base font-semibold text-slate-800">Message Sent!</h3>
              <p className="text-[13px] text-slate-500 mt-1">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                  required
                  aria-required="true"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message, feedback, or story idea..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-none transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20"
              >
                <Send size={14} aria-hidden="true" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
