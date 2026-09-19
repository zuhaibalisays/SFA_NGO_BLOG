import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { primaryNavLinks } from '../config/navigation';

interface HeaderProps {
  onNavigate: (page: string, category?: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50">
      {/* Streamlined Topbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <time dateTime={new Date().toISOString().split('T')[0]} className="text-[11px] tracking-wide text-slate-600 dark:text-slate-400 font-medium">
            {today}
          </time>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 text-[11px] tracking-wide text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={12} strokeWidth={2} aria-hidden="true" /> : <Moon size={12} strokeWidth={2} aria-hidden="true" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 text-[11px] tracking-wide text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
              aria-expanded={searchOpen}
              aria-controls="search-bar"
            >
              <Search size={12} strokeWidth={2} aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div id="search-bar" className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 shadow-sm transition-colors duration-300">
          <div className="max-w-xl mx-auto relative">
            <label htmlFor="search-input" className="sr-only">Search articles, topics, authors</label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={1.5} aria-hidden="true" />
            <input
              id="search-input"
              type="search"
              role="searchbox"
              placeholder="Search articles, topics, authors..."
              aria-label="Search articles, topics, authors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300" aria-label="Primary navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group"
              aria-label="SFA Daily Articles - Go to homepage"
            >
              <img
                src="https://raw.githubusercontent.com/zuhaibalisays/SFA_NGO_BLOG/main/SFA%20Logo.png"
                alt="SFA Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div className="hidden sm:block">
                <span className="text-slate-800 dark:text-white font-semibold text-sm tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                  SFA Daily Articles
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {primaryNavLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page, link.category)}
                  className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    currentPage === link.page
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-current={currentPage === link.page ? 'page' : undefined}
                >
                  {link.label}
                  {currentPage === link.page && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full" aria-hidden="true" />
                  )}
                </button>
              ))}
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-2" aria-hidden="true" />
              <button
                onClick={() => onNavigate('admin')}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200"
                aria-label="Student Writer Login"
              >
                Writer Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="px-4 py-3 space-y-0.5">
              {primaryNavLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => { onNavigate(link.page, link.category); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === link.page
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-current={currentPage === link.page ? 'page' : undefined}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200"
                  aria-label="Student Writer Login"
                >
                  Writer Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
