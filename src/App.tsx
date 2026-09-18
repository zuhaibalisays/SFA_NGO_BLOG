import { useState, useEffect } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import Header from './components/Header';
import FeaturedPosts from './components/FeaturedPosts';
import BlogFeed from './components/BlogFeed';
import ArticleCounter from './components/ArticleCounter';
import Sidebar from './components/Sidebar';
import ArticleView from './components/ArticleView';
import AdminDashboard from './components/AdminDashboard';
import AboutPage from './components/AboutPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import Disclaimer from './components/Disclaimer';
import TermsConditions from './components/TermsConditions';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

function AppContent() {
  const { setActiveCategory, setSearchQuery } = useBlog();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const handleNavigate = (page: string, category?: string) => {
    setCurrentPage(page);
    setSelectedArticleId(null);
    setSearchQuery('');
    if (category) {
      setActiveCategory(category);
    } else {
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
    setActiveCategory('All');
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) handleNavigate(hash);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'article':
        return selectedArticleId ? <ArticleView articleId={selectedArticleId} onBack={handleBack} /> : null;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'terms':
        return <TermsConditions />;
      default:
        return (
          <>
            {currentPage === 'home' && <FeaturedPosts onReadArticle={handleReadArticle} />}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              <div className="min-w-0">
                <BlogFeed onReadArticle={handleReadArticle} />
                <ArticleCounter />
              </div>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Sidebar onReadArticle={handleReadArticle} onContact={() => setContactOpen(true)} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full" role="main">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
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
