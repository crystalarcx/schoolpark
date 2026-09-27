import React, { useState } from 'react';
import { SchoolWithDistance, UserLocation } from '../types';
import { getGoogleMapsNavigationUrl, getAppleMapsNavigationUrl, getCompassDirection } from '../utils/geo';
import { Navigation, Car, Footprints, Clock, MapPin, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface NearestHeroCardProps {
  school: SchoolWithDistance;
  userLocation: UserLocation;
  onViewOnMap: (school: SchoolWithDistance) => void;
}

export const NearestHeroCard: React.FC<NearestHeroCardProps> = ({
  school,
  userLocation,
  onViewOnMap,
}) => {
  const [copied, setCopied] = useState(false);

  const direction = getCompassDirection(
    userLocation.lat,
    userLocation.lng,
    school.lat,
    school.lng
  );

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(school.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = getGoogleMapsNavigationUrl(
    school.lat,
    school.lng,
    `${school.name} (校園停車)`
  );

  const appleMapsUrl = getAppleMapsNavigationUrl(
    school.lat,
    school.lng,
    `${school.name} (校園停車)`
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl shadow-indigo-950/20 border border-indigo-700/30">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-blue-500/15 blur-xl" />

      <div className="relative p-5">
        {/* Header Tag */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>距離您最近的開放校園</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span>{school.district}</span>
            <span aria-hidden="true">·</span>
            <span className={school.isOpenToday ? 'text-emerald-400 font-medium' : 'text-amber-300'}>
              {school.openStatusText}
            </span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {school.name}
              <span className={`text-xs px-2 py-0.5 rounded font-normal ${
                school.feeType === 'free' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {school.feeType === 'free' ? '免費停車' : '收費停車'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span>{school.address}</span>
              <button
                onClick={handleCopyAddress}
                aria-label="複製地址"
                className="ml-1 text-slate-400 hover:text-white transition-colors"
                title="複製地址"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </p>
          </div>

          {/* Large Distance Highlight */}
          <div className="sm:text-right bg-white/10 rounded-xl p-3 sm:p-2 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-white/10 sm:border-0">
            <div className="text-3xl font-extrabold text-amber-300 tabular-nums tracking-tight">
              {school.distanceFormatted}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              往 {direction}方 · 約 {school.driveTimeMin} 分鐘車程
            </div>
          </div>
        </div>

        {/* Trip Stats & Notes */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-white/5 rounded-xl border border-white/10 text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">開車預估</div>
              <div className="font-semibold text-white tabular-nums">約 {school.driveTimeMin} 分鐘</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">步行約</div>
              <div className="font-semibold text-white tabular-nums">{school.walkTimeMin} 分鐘</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">開放時段</div>
              <div className="font-medium text-white truncate max-w-[90px]" title={school.openingHoursHint}>
                日間開放
              </div>
            </div>
          </div>
        </div>

        {/* Fee & Nearby Landmarks */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 mb-4">
          <span className="text-amber-200 font-medium">{school.feeNote}</span>
          <span aria-hidden="true">·</span>
          <span>周邊：{school.nearbyLandmarks.slice(0, 3).join('、')}</span>
        </div>

        {/* Actions Buttons: iPhone Thumb zone optimized */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action: Google Maps Navigation */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(15);
            }}
            className="flex items-center justify-center gap-2 w-full h-[50px] px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/25 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4 fill-slate-950" />
            <span>Google 地圖路線導航</span>
          </a>

          {/* Secondary Actions Row for iPhone */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(15);
              }}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 active:scale-[0.98] transition-all backdrop-blur-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
              <span>Apple 地圖導航</span>
            </a>

            <button
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(10);
                onViewOnMap(school);
              }}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/15 active:scale-[0.98] transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-300" />
              <span>在地圖上查看</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
