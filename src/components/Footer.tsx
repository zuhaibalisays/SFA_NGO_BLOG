import { footerQuickLinks, footerCategoryLinks, socialLinks } from '../config/navigation';

interface FooterProps {
  onNavigate: (page: string, category?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 mt-16 transition-colors duration-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://raw.githubusercontent.com/zuhaibalisays/SFA_NGO_BLOG/main/SFA%20Logo.png" alt="" width={32} height={32} className="w-8 h-8 object-contain" aria-hidden="true" />
              <span className="text-slate-800 dark:text-white font-semibold text-sm tracking-tight">SFA Daily Articles</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[12px] leading-relaxed max-w-xs">
              School-for-All Welfare Organization is a non-profit established on <time dateTime="2020-10-01">October 1, 2020</time> in Turbat, Balochistan — empowering student voices through education and expression.
            </p>
            <nav aria-label="Social media links" className="flex gap-2 mt-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="w-7 h-7 rounded-md bg-slate-200 dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.08] flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400 text-slate-600 dark:text-slate-400 transition-all duration-200" aria-label={social.ariaLabel}>
                  <i className={`${social.icon} text-[11px]`} aria-hidden="true"></i>
                </a>
              ))}
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <h2 className="text-[11px] font-semibold text-slate-700 dark:text-slate-500 uppercase tracking-wider mb-3">Quick Links</h2>
            <ul className="space-y-1.5">
              {footerQuickLinks.map(link => (
                <li key={link.page + link.label}>
                  <button onClick={() => onNavigate(link.page, link.category)} className="text-[12px] text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">{link.label}</button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Footer categories">
            <h2 className="text-[11px] font-semibold text-slate-700 dark:text-slate-500 uppercase tracking-wider mb-3">Categories</h2>
            <ul className="space-y-1.5">
              {footerCategoryLinks.map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page, link.category)} className="text-[12px] text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">{link.label}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-slate-300 dark:border-white/[0.06] mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-600 dark:text-slate-500">© {currentYear} SFA Daily Articles. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-500">Designed for School-for-All Welfare Organization · Turbat, Balochistan</p>
        </div>
      </div>
    </footer>
  );
}
