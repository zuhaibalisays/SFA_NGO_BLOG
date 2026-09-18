import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Latest Published', page: 'latest' },
    { label: 'Articles', page: 'articles' },
    { label: 'Book Reviews', page: 'book-reviews' },
    { label: 'Letters', page: 'letters' },
    { label: 'About SFA', page: 'about' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#0B132B] text-white/80 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:block">{today}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {searchOpen && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search articles, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-[#0F172A] dark:bg-[#0B132B] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
                S
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg leading-tight group-hover:text-amber-400 transition-colors">
                  SFA Daily Articles
                </h1>
                <p className="text-amber-400/80 text-[10px] leading-tight">
                  Empowering Student Voices in Balochistan
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-amber-400 bg-white/10'
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => onNavigate('admin')}
                className="ml-2 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                <i className="fas fa-pen-to-square mr-1"></i>
                Student Writer
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0F172A]">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-amber-400 bg-white/10'
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-amber-400 bg-amber-500/10 mt-2"
              >
                <i className="fas fa-pen-to-square mr-2"></i>
                Student Writer Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
