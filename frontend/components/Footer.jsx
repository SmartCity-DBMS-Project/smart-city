import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Main site pages organized by category
  const mainPages = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Departments', href: '/departments' },
    { name: 'Login', href: '/login' }
  ];

  const directoryPages = [
    { name: 'Contact Directory', href: '/contact-directory' },
    { name: 'Public Representatives', href: '/public-representatives' },
    { name: 'Helpline', href: '/helpline' },
    { name: 'STD & PIN Codes', href: '/std-pin-codes' },
    { name: 'Public Buildings', href: '/public-buildings' }
  ];

  return (
    <footer 
      className="bg-primary text-primary-foreground py-16"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Smart City Portal</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Empowering smart cities through data-driven solutions and citizen services.
            </p>
          </div>

          {/* Main Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Main Pages</h3>
            <ul className="space-y-3">
              {mainPages.map((page) => (
                <li key={page.href}>
                  <Link 
                    href={page.href}
                    className="text-sm hover:text-acc-orange transition-colors duration-200 block"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Directory</h3>
            <ul className="space-y-3">
              {directoryPages.map((page) => (
                <li key={page.href}>
                  <Link 
                    href={page.href}
                    className="text-sm hover:text-acc-orange transition-colors duration-200 block"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-primary-foreground/80">
              © {currentYear} Smart City Portal. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/60">
              Built for the future of urban living
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
