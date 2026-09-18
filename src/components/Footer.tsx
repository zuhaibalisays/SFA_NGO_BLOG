export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-bold text-white text-[10px]">
                S
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">SFA Daily Articles</span>
            </div>
            <p className="text-slate-400 text-[12px] leading-relaxed max-w-xs">
              School-for-All Welfare Organization is a non-profit established on October 1, 2020 in Turbat, Balochistan — empowering student voices through education and expression.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                { icon: 'fab fa-facebook-f', href: '#' },
                { icon: 'fab fa-twitter', href: '#' },
                { icon: 'fab fa-youtube', href: '#' },
                { icon: 'fab fa-instagram', href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-7 h-7 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 text-slate-400 transition-all duration-200"
                >
                  <i className={`${social.icon} text-[11px]`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {['Home', 'About SFA', 'Latest Articles', 'Book Reviews', 'Contact Us', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[12px] text-slate-400 hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-1.5">
              {['Articles', 'Book Reviews', 'Letters', 'Social Issues', 'Stories', 'Weekly Reports', 'Motivational'].map(cat => (
                <li key={cat}>
                  <a href="#" className="text-[12px] text-slate-400 hover:text-white transition-colors duration-200">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            © {currentYear} SFA Daily Articles. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-500">
            Designed for School-for-All Welfare Organization · Turbat, Balochistan
          </p>
        </div>
      </div>
    </footer>
  );
}
