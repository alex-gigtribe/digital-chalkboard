// src/layout/Footer.tsx

import { Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white text-sm mt-12">
      <div className="max-w-container mx-auto px-4 md:px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div>
            <h3 className="font-semibold mb-1">AdaginTech</h3>
            <p className="text-white/85">Simplifying agricultural technologies for confident daily decisions.</p>
            <div className="mt-2 flex flex-col gap-2">
              <a href="https://adagintech.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
                <Globe className="w-4 h-4 text-white/90" />
                adagintech.com
              </a>
              <a href="https://www.adagintech.com/contact/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-success font-medium hover:underline">
                <Mail className="w-4 h-4" />
                Request a demo
              </a>
            </div>
          </div>

          <div /> {/* spacer */}

          <div className="flex flex-col items-start md:items-end justify-center gap-1">
            <p className="font-semibold">© 2025 AdaginTech. All rights reserved.</p>
            <p className="text-white/75">Digital Chalkboard · Hutton Squire · v1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
