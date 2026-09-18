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
}

export type Category =
  | 'Articles'
  | 'Book Review'
  | 'Letter'
  | 'Social Issue'
  | 'Story'
  | 'Weekly Report'
  | 'Motivational';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
