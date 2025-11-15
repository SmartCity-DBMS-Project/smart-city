"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand / Info */}
        <div>
          <h3 className="text-lg font-semibold">Smart City Portal</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Public information and citizen services.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-md font-semibold mb-3">Public Pages</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:underline" href="/departments">
                Departments
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/contact-directory">
                Contact Directory
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/public-representatives">
                Public Representatives
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/helpline">
                Helpline
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/std-pincodes">
                STD & Pincodes
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/public-utilities">
                Public Utilities
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Footer note */}
        <div>
          <h4 className="text-md font-semibold mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">
            For queries or support, visit the helpline or contact directory.
          </p>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-6 flex justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Smart City Portal</p>
          <p>Designed for public services</p>
        </div>
      </div>
    </footer>
  );
}
