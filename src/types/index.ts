export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: Category;
  coverImage: string;
  date: string;
  readTime: number;
  featured: boolean;
  views: number;
  tags: string[];
  language?: ArticleLanguage;
  font?: ArticleFont;
}

export type ArticleLanguage = 'English' | 'Balochi' | 'Urdu';

export type ArticleFont =
  | 'Inter'
  | 'Noto Naskh Arabic'
  | 'Vazirmatn'
  | 'Scheherazade New'
  | 'Amiri'
  | 'Noto Nastaliq Urdu';

export type Category =
  | 'Articles'
  | 'Book Reviews'
  | 'Letters'
  | 'Social Issues'
  | 'Stories'
  | 'Weekly Reports'
  | 'Motivational';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
