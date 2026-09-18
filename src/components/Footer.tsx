export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B132B] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About SFA */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-white text-lg">
                S
              </div>
              <div>
                <h3 className="font-bold text-lg">SFA Daily Articles</h3>
                <p className="text-amber-400/80 text-xs">Empowering Student Voices in Balochistan</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
              School-for-All Welfare Organization (SFA) is a non-profit established on October 1, 2020, 
              in Turbat, Balochistan. We are dedicated to promoting education, empowering youth, and 
              creating platforms for student expression and community development.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'fab fa-facebook-f', href: '#' },
                { icon: 'fab fa-twitter', href: '#' },
                { icon: 'fab fa-youtube', href: '#' },
                { icon: 'fab fa-instagram', href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About SFA', 'Latest Articles', 'Book Reviews', 'Contact Us', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/60 text-sm hover:text-amber-400 transition-colors flex items-center gap-2">
                    <i className="fas fa-chevron-right text-[8px] text-amber-500/60"></i>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4">Categories</h4>
            <ul className="space-y-2">
              {['Articles', 'Book Reviews', 'Letters', 'Social Issues', 'Stories', 'Weekly Reports', 'Motivational'].map(cat => (
                <li key={cat}>
                  <a href="#" className="text-white/60 text-sm hover:text-amber-400 transition-colors flex items-center gap-2">
                    <i className="fas fa-tag text-[8px] text-amber-500/60"></i>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {currentYear} SFA Daily Articles. All rights reserved.
          </p>
          <p className="text-white/40 text-xs text-center md:text-right">
            Designed with ❤️ for School-for-All Welfare Organization | Turbat, Balochistan
          </p>
        </div>
      </div>
    </footer>
  );
}
