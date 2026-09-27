import React from 'react';
import { District, FeeType } from '../types';
import { Search, Map, List, X, Filter } from 'lucide-react';

interface FilterBarProps {
  selectedDistrict: District | 'all';
  onSelectDistrict: (district: District | 'all') => void;
  districtCounts: Record<District | 'all', number>;
  selectedFee: FeeType | 'all';
  onSelectFee: (fee: FeeType | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  onlyOpenToday: boolean;
  onToggleOnlyOpenToday: () => void;
}

const DISTRICTS: (District | 'all')[] = [
  'all',
  '中西區',
  '東區',
  '北區',
  '南區',
  '安平區',
  '永康區',
  '新化區',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDistrict,
  onSelectDistrict,
  districtCounts,
  selectedFee,
  onSelectFee,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onlyOpenToday,
  onToggleOnlyOpenToday,
}) => {
  return (
    <div className="space-y-3 mb-5">
      {/* Top Search & View Mode Switcher */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋學校、路名或周邊景點..."
            className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white border border-slate-200/90 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90"
              aria-label="清除搜尋"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl shrink-0">
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>列表</span>
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>地圖</span>
          </button>
        </div>
      </div>

      {/* Horizontal District Pills Scroller */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 min-w-max pb-1">
          {DISTRICTS.map((district) => {
            const isSelected = selectedDistrict === district;
            const count = districtCounts[district] || 0;
            const label = district === 'all' ? '全部行政區' : district;
            return (
              <button
                key={district}
                onClick={() => onSelectDistrict(district)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-500" />
          收費篩選：
        </span>

        <button
          onClick={() => onSelectFee('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedFee === 'all'
              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          全部
        </button>

        <button
          onClick={() => onSelectFee('free')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedFee === 'free'
              ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          僅顯示免費
        </button>

        <button
          onClick={() => onSelectFee('paid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedFee === 'paid'
              ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          僅顯示收費
        </button>

        <span className="text-slate-300">|</span>

        <button
          onClick={onToggleOnlyOpenToday}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            onlyOpenToday
              ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {onlyOpenToday ? '✓ 僅今日開放' : '僅今日開放'}
        </button>
      </div>
    </div>
  );
};
