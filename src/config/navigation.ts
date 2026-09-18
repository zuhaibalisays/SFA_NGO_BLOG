/**
 * Shared navigation configuration used by Header and Footer.
 * Single source of truth for all navigation links across the app.
 */

export interface NavLink {
  label: string;
  page: string;
  /** Optional: maps to a category filter when navigating */
  category?: string;
}

export const primaryNavLinks: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'Latest', page: 'latest' },
  { label: 'Articles', page: 'articles', category: 'Articles' },
  { label: 'Book Reviews', page: 'book-reviews', category: 'Book Reviews' },
  { label: 'Letters', page: 'letters', category: 'Letters' },
  { label: 'About', page: 'about' },
];

export const footerQuickLinks: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'About SFA', page: 'about' },
  { label: 'Latest Articles', page: 'latest' },
  { label: 'Book Reviews', page: 'book-reviews', category: 'Book Reviews' },
  { label: 'Contact Us', page: 'contact' },
  { label: 'Privacy Policy', page: 'privacy' },
];

export const footerCategoryLinks: NavLink[] = [
  { label: 'Articles', page: 'articles', category: 'Articles' },
  { label: 'Book Reviews', page: 'book-reviews', category: 'Book Reviews' },
  { label: 'Letters', page: 'letters', category: 'Letters' },
  { label: 'Social Issues', page: 'articles', category: 'Social Issues' },
  { label: 'Stories', page: 'articles', category: 'Stories' },
  { label: 'Weekly Reports', page: 'articles', category: 'Weekly Reports' },
  { label: 'Motivational', page: 'articles', category: 'Motivational' },
];

/** All unique categories used for filtering */
export const allCategories = [
  'All',
  'Articles',
  'Book Reviews',
  'Letters',
  'Social Issues',
  'Stories',
  'Weekly Reports',
  'Motivational',
] as const;

/** Sidebar tag labels (same as categories minus "All") */
export const sidebarTags = allCategories.filter(c => c !== 'All');

/** Social media links */
export const socialLinks = [
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: '#', ariaLabel: 'Follow SFA on Facebook' },
  { icon: 'fab fa-twitter', label: 'Twitter', href: '#', ariaLabel: 'Follow SFA on Twitter' },
  { icon: 'fab fa-youtube', label: 'YouTube', href: '#', ariaLabel: 'Follow SFA on YouTube' },
  { icon: 'fab fa-instagram', label: 'Instagram', href: '#', ariaLabel: 'Follow SFA on Instagram' },
] as const;
