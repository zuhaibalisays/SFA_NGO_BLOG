import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Article, Category } from '../types';
import { Lock, LogOut, Plus, Edit3, Trash2, Save, FileText, Eye } from 'lucide-react';

const categories: Category[] = ['Articles', 'Book Reviews', 'Letters', 'Social Issues', 'Stories', 'Weekly Reports', 'Motivational'];

export default function AdminDashboard() {
  const { isAdminLoggedIn, adminLogin, adminLogout, articles, addArticle, updateArticle, deleteArticle } = useBlog();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('SFA Student Writer');
  const [category, setCategory] = useState<Category>('Articles');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('SFA Student Writer');
    setCategory('Articles');
    setCoverImage('');
    setExcerpt('');
    setContent('');
    setFeatured(false);
    setEditingId(null);
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt) {
      setSuccessMsg('Please fill in all required fields.');
      return;
    }

    const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    if (editingId) {
      updateArticle(editingId, {
        title, author, category, coverImage: coverImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
        excerpt, content, featured, readTime,
        tags: [category, ...category.split(' ')].filter(Boolean),
      });
      setSuccessMsg('Article updated successfully!');
    } else {
      addArticle({
        title, author, category,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
        excerpt, content, featured, readTime,
        tags: [category, ...category.split(' ')].filter(Boolean),
      });
      setSuccessMsg('Article published successfully!');
    }
    resetForm();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setAuthor(article.author);
    setCategory(article.category);
    setCoverImage(article.coverImage);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setFeatured(article.featured);
    setEditingId(article.id);
    setActiveTab('create');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  // Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20">
                <Lock className="text-white" size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Student Writer Login</h2>
              <p className="text-sm text-slate-500 mt-1">
                Access the article editor to create and manage posts
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Writer Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-[13px]">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors duration-200"
              >
                Login to Dashboard
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Hint: Default passcode is "sfa2024writer"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-500" size={20} />
            Writer Dashboard
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Create, edit, and manage articles</p>
        </div>
        <button
          onClick={adminLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 rounded-lg text-[12px] font-medium hover:bg-red-100 transition-colors duration-200 ring-1 ring-red-200/50"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
            activeTab === 'create'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus size={14} />
          {editingId ? 'Edit Article' : 'Create New'}
        </button>
        <button
          onClick={() => { setActiveTab('manage'); resetForm(); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
            activeTab === 'manage'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Eye size={14} />
          Manage ({articles.length})
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-[13px] font-medium">
          ✓ {successMsg}
        </div>
      )}

      {/* Create/Edit Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image URL */}
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Excerpt / Summary *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the article (shown in article cards)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-none transition-all duration-200"
                  required
                />
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/30"
                  />
                  <span className="text-[13px] text-slate-600 font-medium">
                    Mark as Featured (appears in featured section)
                  </span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Article Content * <span className="text-slate-400 font-normal">(Markdown: ## Headings, **bold**, - lists, &gt; quotes)</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={'Write your article content here...\n\nUse ## for headings\nUse **text** for bold\nUse - for bullet points\nUse > for quotes'}
                rows={14}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-y font-mono leading-relaxed transition-all duration-200"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2.5">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-400 transition-colors duration-200 shadow-sm shadow-amber-500/20"
              >
                <Save size={14} />
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors duration-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Manage Articles */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-slate-800 line-clamp-1">{article.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{article.author}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 tracking-wide uppercase">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-500 hidden sm:table-cell">{article.date}</td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-500 hidden lg:table-cell">{article.views}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
