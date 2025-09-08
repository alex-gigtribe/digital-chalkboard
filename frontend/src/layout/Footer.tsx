import { Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-accent mt-12 text-sm md:text-lg lg:text-sm"> {/* Smaller font on mobile, bigger on md, smaller again on lg+ */}
      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-4"> {/* Reduced padding on mobile and lg+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-4"> {/* Reduced gap on mobile and lg+ */}
          
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-3 lg:mb-2"> {/* Reduced margin on mobile and lg+ */}
              AdaginTech
            </h3>
            <p className="text-grey-contrast mb-2 md:mb-4 lg:mb-2"> {/* Reduced margin on mobile and lg+ */}
              Simplifying precision agriculture technologies for all use.
            </p>
            <div className="space-y-1 md:space-y-2 lg:space-y-1 text-grey-contrast"> {/* Reduced spacing on mobile and lg+ */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-primary" /> {/* Smaller icon on mobile and lg+ */}
                <a
                  href="https://adagintech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  adagintech.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-7 h-7 md:w-7 md:h-7 lg:w-7 lg:h-7 text-tertiary" />
                <a
                  href="https://www.adagintech.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:tertiary transition-colors font-bold text-base md:text-lg lg:text-base"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>

          {/* Partner Info */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-3 lg:mb-2"> {/* Reduced margin on mobile and lg+ */}
              Metaship.ai
            </h3>
            <p className="text-grey-contrast mb-2 md:mb-4 lg:mb-2"> {/* Reduced margin on mobile and lg+ */}
              Revolutionising Logistics
              Utilizing AI and Big Data Precision
            </p>
            <div className="space-y-1 md:space-y-2 lg:space-y-1 text-grey-contrast"> {/* Reduced spacing on mobile and lg+ */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-primary" /> {/* Smaller icon on mobile and lg+ */}
                <a
                  href="https://metaship.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  metaship.ai
                </a>
              </div>
            </div>
          </div>

          {/* Copyright and Version Info */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white font-semibold mb-2 md:mb-3 lg:mb-2"> {/* Reduced margin on mobile and lg+ */}
                © 2025 AdaginTech. All rights reserved. x Powered by Metaship.ai
              </p>
            </div>
            <div>
              <p className="text-grey-contrast">
                PoC Version 1.0.0 | Real-time Sync Enabled | Enterprise Edition
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}