import React from 'react';
import { HelpCircle, RefreshCw, Car } from 'lucide-react';

interface NavbarProps {
  onOpenTips: () => void;
  onRefreshGps: () => void;
  isLocating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTips,
  onRefreshGps,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-slate-900">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20">
            <Car className="w-4 h-4" />
          </div>
          <span>台南週末校園停車</span>
        </a>

        {/* Zone 2: Info hint */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>即時 GPS 定位距離計算</span>
          <span aria-hidden="true">·</span>
          <span>7 大行政區 21 所開放學校</span>
        </div>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshGps}
            disabled={isLocating}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="刷新 GPS 定位"
            aria-label="刷新 GPS 定位"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">重新定位</span>
          </button>

          <button
            onClick={onOpenTips}
            className="flex items-center gap-1 h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors"
            title="查看停車須知"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>停車須知</span>
          </button>
        </div>
      </div>
    </header>
  );
};
