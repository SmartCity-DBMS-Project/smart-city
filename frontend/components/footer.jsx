"use client";

export default function Footer() {
  const links = [
    { href: "/departments",           label: "Departments" },
    { href: "/contact-directory",     label: "Contact Directory" },
    { href: "/public-representatives",label: "Public Representatives" },
    { href: "/helpline",              label: "Helpline" },
    { href: "/std-pin-codes",         label: "STD & Pincodes" },
    { href: "/public-utilities",      label: "Public Utilities" },
  ];

  return (
    <footer className="w-full bg-primary text-primary-foreground border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-acc-orange text-white text-xs font-bold">SC</span>
            <h3 className="text-sm font-semibold text-white">Smart City Portal</h3>
          </div>
          <p className="text-sm text-white/50">
            Public information and citizen services for a connected city.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Public Pages</h4>
          <ul className="space-y-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-white/60 hover:text-acc-orange transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Support</h4>
          <p className="text-sm text-white/50">
            For queries or support, visit the helpline or contact directory pages.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Smart City Portal</p>
          <p className="text-xs text-white/30">Designed for public services</p>
        </div>
      </div>
    </footer>
  );
}
