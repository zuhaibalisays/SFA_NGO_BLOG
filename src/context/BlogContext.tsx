import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article, ContactMessage } from '../types';
import { sampleArticles } from '../data/sampleArticles';

interface BlogContextType {
  articles: Article[];
  filteredArticles: Article[];
  searchQuery: string;
  activeCategory: string;
  isAdminLoggedIn: boolean;
  contacts: ContactMessage[];
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addArticle: (article: Omit<Article, 'id' | 'date' | 'views'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addContact: (message: Omit<ContactMessage, 'id' | 'date'>) => void;
  incrementViews: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'sfa2024writer';
const STORAGE_KEY_ARTICLES = 'sfa_articles';
const STORAGE_KEY_CONTACTS = 'sfa_contacts';
const STORAGE_KEY_ADMIN = 'sfa_admin_logged';

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (stored) {
      try { return JSON.parse(stored); } catch { return sampleArticles; }
    }
    return sampleArticles;
  });

  const [contacts, setContacts] = useState<ContactMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  const addArticle = useCallback((article: Omit<Article, 'id' | 'date' | 'views'>) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
    };
    setArticles(prev => [newArticle, ...prev]);
  }, []);

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);

  const adminLogin = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEY_ADMIN, 'true');
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEY_ADMIN);
  }, []);

  const addContact = useCallback((message: Omit<ContactMessage, 'id' | 'date'>) => {
    const newContact: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [newContact, ...prev]);
  }, []);

  const incrementViews = useCallback((id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, views: a.views + 1 } : a));
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <BlogContext.Provider value={{
      articles,
      filteredArticles,
      searchQuery,
      activeCategory,
      isAdminLoggedIn,
      contacts,
      setSearchQuery,
      setActiveCategory,
      addArticle,
      updateArticle,
      deleteArticle,
      adminLogin,
      adminLogout,
      addContact,
      incrementViews,
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within BlogProvider');
  return context;
}
