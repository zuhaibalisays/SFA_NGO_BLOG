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
  { label: 'Articles', page: 'articles' },
  { label: 'About', page: 'about' },
];

export const footerQuickLinks: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'About SFA', page: 'about' },
  { label: 'Articles', page: 'articles' },
  { label: 'Privacy Policy', page: 'privacy' },
  { label: 'Disclaimer', page: 'disclaimer' },
  { label: 'Terms & Conditions', page: 'terms' },
];

export const footerCategoryLinks: NavLink[] = [
  { label: 'Articles', page: 'articles', category: 'Articles' },
  { label: 'Book Reviews', page: 'articles', category: 'Book Reviews' },
  { label: 'Letters', page: 'articles', category: 'Letters' },
  { label: 'Social Issues', page: 'articles', category: 'Social Issues' },
  { label: 'Stories', page: 'articles', category: 'Stories' },
  { label: 'Weekly Reports', page: 'articles', category: 'Weekly Reports' },
  { label: 'Motivational', page: 'articles', category: 'Motivational' },
];

/** All unique categories used for filtering */
export const allCategories = [
  'All',
  'Latest',
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

/** Contact form subject options */
export const contactSubjects = [
  { value: 'enquiry', label: 'General Enquiry' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'write-article', label: 'Want to Write an Article' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'other', label: 'Other' },
] as const;
