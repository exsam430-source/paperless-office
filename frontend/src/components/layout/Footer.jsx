import React from 'react';
import { Heart, Github, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass-strong border-t border-white/20 dark:border-white/10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left side */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                © {currentYear} Paperless Office
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" /> for Education
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:support@paperlessoffice.edu"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;