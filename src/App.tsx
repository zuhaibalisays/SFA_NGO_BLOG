import { useState, useEffect } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import Header from './components/Header';
import FeaturedPosts from './components/FeaturedPosts';
import BlogFeed from './components/BlogFeed';
import Sidebar from './components/Sidebar';
import ArticleView from './components/ArticleView';
import AdminDashboard from './components/AdminDashboard';
import AboutPage from './components/AboutPage';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

function AppContent() {
  const { setActiveCategory, setSearchQuery } = useBlog();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedArticleId(null);
    setSearchQuery('');

    // Set category based on page
    switch (page) {
      case 'articles':
        setActiveCategory('Articles');
        break;
      case 'book-reviews':
        setActiveCategory('Book Review');
        break;
      case 'letters':
        setActiveCategory('Letter');
        break;
      case 'latest':
        setActiveCategory('All');
        break;
      default:
        setActiveCategory('All');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentPage('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticleId(null);
    setCurrentPage('home');
  };

  // Handle initial hash-based routing
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      handleNavigate(hash);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B132B] transition-colors duration-300">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Article View */}
        {currentPage === 'article' && selectedArticleId && (
          <ArticleView articleId={selectedArticleId} onBack={handleBack} />
        )}

        {/* Admin Dashboard */}
        {currentPage === 'admin' && (
          <AdminDashboard />
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <AboutPage />
        )}

        {/* Home / Category Pages */}
        {(currentPage === 'home' || currentPage === 'latest' || currentPage === 'articles' || currentPage === 'book-reviews' || currentPage === 'letters') && (
          <>
            {/* Featured Posts (only on home) */}
            {currentPage === 'home' && (
              <FeaturedPosts onReadArticle={handleReadArticle} />
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <BlogFeed onReadArticle={handleReadArticle} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Sidebar onReadArticle={handleReadArticle} onContact={() => setContactOpen(true)} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}
