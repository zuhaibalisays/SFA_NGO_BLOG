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

    switch (page) {
      case 'articles':
        setActiveCategory('Articles');
        break;
      case 'book-reviews':
        setActiveCategory('Book Reviews');
        break;
      case 'letters':
        setActiveCategory('Letters');
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      handleNavigate(hash);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Main Content */}
              <div className="min-w-0">
                <BlogFeed onReadArticle={handleReadArticle} />
              </div>

              {/* Sidebar */}
              <div className="lg:sticky lg:top-28 lg:self-start">
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
