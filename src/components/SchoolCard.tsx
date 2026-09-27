import React, { useState } from 'react';
import { SchoolWithDistance, UserLocation } from '../types';
import { getGoogleMapsNavigationUrl, getCompassDirection } from '../utils/geo';
import { Navigation, MapPin, Check, Copy, Car, Footprints, Clock, ChevronRight } from 'lucide-react';

interface SchoolCardProps {
  school: SchoolWithDistance;
  rank: number;
  userLocation: UserLocation;
  onViewOnMap: (school: SchoolWithDistance) => void;
  isNearest?: boolean;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  rank,
  userLocation,
  onViewOnMap,
  isNearest = false,
}) => {
  const [copied, setCopied] = useState(false);

  const direction = getCompassDirection(
    userLocation.lat,
    userLocation.lng,
    school.lat,
    school.lng
  );

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('vibrate' in navigator) navigator.vibrate(10);
    navigator.clipboard.writeText(school.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const googleMapsUrl = getGoogleMapsNavigationUrl(
    school.lat,
    school.lng,
    `${school.name} (校園停車)`
  );

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white border transition-all duration-200 ${
        isNearest
          ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Rank + District + Distance */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold tabular-nums ${
                rank === 1
                  ? 'bg-amber-500 text-white shadow-sm'
                  : rank <= 3
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {rank}
            </span>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {school.district}
            </span>

            <span
              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                school.feeType === 'free'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {school.feeType === 'free' ? '免費' : '收費'}
            </span>
          </div>

          {/* Distance & Direction */}
          <div className="text-right shrink-0">
            <span className="text-lg font-extrabold text-indigo-700 tabular-nums">
              {school.distanceFormatted}
            </span>
            <div className="text-[11px] text-slate-600">
              往 {direction}方
            </div>
          </div>
        </div>

        {/* School Name & Address */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {school.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{school.address}</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-1 p-0.5"
              title="複製地址"
              aria-label="複製地址"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </p>
        </div>

        {/* Open rules & fee details */}
        <div className="space-y-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">收費情況：</span>
            <span className="font-medium text-slate-800">{school.feeNote}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">開放時段：</span>
            <span className="font-medium text-slate-800 truncate max-w-[200px]" title={school.openingHoursHint}>
              {school.openSchedule}
            </span>
          </div>
          {school.specialOpenNote && (
            <div className="flex items-center justify-between text-amber-700 font-medium">
              <span>特別備註：</span>
              <span>{school.specialOpenNote}</span>
            </div>
          )}
        </div>

        {/* Nearby Highlights */}
        {school.nearbyLandmarks.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] text-slate-600 mb-1 font-medium">鄰近商圈 / 景點：</div>
            <div className="flex flex-wrap gap-1">
              {school.nearbyLandmarks.map((spot) => (
                <span
                  key={spot}
                  className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                >
                  {spot}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions: iPhone Thumb Zone Optimized */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(10);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs active:scale-[0.97] transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Google 地圖導航</span>
          </a>

          <button
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(10);
              onViewOnMap(school);
            }}
            className="flex items-center justify-center gap-1 h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium active:scale-[0.97] transition-all shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>地圖</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
