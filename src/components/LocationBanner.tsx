import React, { useState } from 'react';
import { UserLocation } from '../types';
import { TAINAN_LOCATION_PRESETS } from '../data/schools';
import { Navigation, RefreshCw, AlertCircle, Compass, ChevronDown, Check } from 'lucide-react';

interface LocationBannerProps {
  userLocation: UserLocation;
  isLocating: boolean;
  gpsError: string | null;
  onRefreshGps: () => void;
  onSelectSimulatedLocation: (preset: typeof TAINAN_LOCATION_PRESETS[0]) => void;
  onResetToRealGps: () => void;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({
  userLocation,
  isLocating,
  gpsError,
  onRefreshGps,
  onSelectSimulatedLocation,
  onResetToRealGps,
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: GPS Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isLocating
                ? 'bg-blue-100 text-blue-600 animate-spin'
                : userLocation.isSimulated
                ? 'bg-amber-100 text-amber-700'
                : gpsError
                ? 'bg-red-100 text-red-600'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isLocating ? (
              <RefreshCw className="w-4 h-4" />
            ) : userLocation.isSimulated ? (
              <Compass className="w-4 h-4" />
            ) : gpsError ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {userLocation.isSimulated
                  ? `模擬定位：${userLocation.simulatedName}`
                  : isLocating
                  ? '正在精準取得 GPS 定位中...'
                  : gpsError
                  ? 'GPS 定位受限'
                  : '手機即時 GPS 定位成功'}
              </span>

              {!userLocation.isSimulated && !gpsError && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  即時更新
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {userLocation.isSimulated ? (
                '點擊右側可切換台南景點或還原真實 GPS'
              ) : gpsError ? (
                `${gpsError}（已自動切換至台南市中心孔廟供測試）`
              ) : (
                `目前經緯度：${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}${
                  userLocation.accuracy ? ` · 精度約 ±${Math.round(userLocation.accuracy)}m` : ''
                }`
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {userLocation.isSimulated ? (
            <button
              onClick={onResetToRealGps}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>使用真實 GPS</span>
            </button>
          ) : (
            <button
              onClick={onRefreshGps}
              disabled={isLocating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
              title="重新取得即時位置"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>重整定位</span>
            </button>
          )}

          {/* Preset Selector */}
          <div className="relative">
            <button
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(10);
                setShowPresetDropdown(!showPresetDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 active:scale-95 transition-all"
            >
              <span>切換位置</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showPresetDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity"
                  onClick={() => setShowPresetDropdown(false)}
                />

                {/* Mobile Bottom Sheet (iPhone friendly, no text clipping) */}
                <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl p-4 pb-[max(env(safe-area-inset-bottom),20px)] sm:hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-200">
                  {/* iOS drag pill */}
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
                  
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">選擇台南測試出發地</h3>
                      <p className="text-[11px] text-slate-500">切換後將自動計算由此出發至各校之距離</p>
                    </div>
                    <button
                      onClick={() => setShowPresetDropdown(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg font-medium"
                    >
                      關閉
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 py-1">
                    {TAINAN_LOCATION_PRESETS.map((preset) => {
                      const isSelected =
                        userLocation.isSimulated &&
                        userLocation.simulatedName === preset.name;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => {
                            if ('vibrate' in navigator) navigator.vibrate(10);
                            onSelectSimulatedLocation(preset);
                            setShowPresetDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-3 flex items-center justify-between rounded-xl transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-900 font-bold'
                              : 'text-slate-800 active:bg-slate-100'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-sm font-medium text-slate-900">{preset.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{preset.district}</div>
                          </div>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded-full shrink-0">
                              <Check className="w-3.5 h-3.5" />
                              使用中
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-normal shrink-0">選擇</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Dropdown */}
                <div className="hidden sm:block absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-100 flex items-center justify-between">
                    <span>測試快速選取出發地</span>
                    <span className="text-[10px] text-slate-400 font-normal">模擬位置</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {TAINAN_LOCATION_PRESETS.map((preset) => {
                      const isSelected =
                        userLocation.isSimulated &&
                        userLocation.simulatedName === preset.name;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => {
                            onSelectSimulatedLocation(preset);
                            setShowPresetDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-indigo-50/70 text-indigo-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{preset.name}</div>
                            <div className="text-[11px] text-slate-400 font-normal">
                              {preset.district}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
