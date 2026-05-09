import React from 'react';
import { Shield } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="relative border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              Face<span className="text-gradient">Shield</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Privacy-first face enrollment system. All processing happens locally.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">MVP v1.0</span>
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            <span className="text-xs text-muted-foreground">Hackathon 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
