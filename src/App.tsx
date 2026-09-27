/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TAINAN_SCHOOLS, TAINAN_LOCATION_PRESETS } from './data/schools';
import { District, FeeType, SchoolWithDistance, UserLocation } from './types';
import { sortSchoolsByDistance, getGoogleMapsNavigationUrl } from './utils/geo';
import { Navbar } from './components/Navbar';
import { NearestHeroCard } from './components/NearestHeroCard';
import { SchoolCard } from './components/SchoolCard';
import { MapView } from './components/MapView';
import { FilterBar } from './components/FilterBar';
import { LocationBanner } from './components/LocationBanner';
import { ParkingTipsModal } from './components/ParkingTipsModal';
import { Navigation, MapPin, Sparkles, AlertCircle, Info } from 'lucide-react';

// Default initial location: Tainan City Center (Confucius Temple area)
const DEFAULT_TAINAN_LOCATION: UserLocation = {
  lat: 22.9902,
  lng: 120.2045,
  accuracy: 15,
  isSimulated: true,
  simulatedName: '台南孔廟 (預設位置)',
};

export default function App() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_TAINAN_LOCATION);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<District | 'all'>('all');
  const [selectedFee, setSelectedFee] = useState<FeeType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyOpenToday, setOnlyOpenToday] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [selectedSchool, setSelectedSchool] = useState<SchoolWithDistance | null>(null);
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);

  // Request high-accuracy GPS position from user's phone browser
  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('您的瀏覽器不支援 GPS 定位');
      setIsLocating(false);
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          isSimulated: false,
        });
        setIsLocating(false);
        setGpsError(null);
      },
      (err) => {
        let msg = '無法取得定位';
        if (err.code === err.PERMISSION_DENIED) {
          msg = '請允許瀏覽器存取位置資訊以計算即時距離';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = '位置資訊無法取得，請確認手機 GPS 是否開啟';
        } else if (err.code === err.TIMEOUT) {
          msg = '定位逾時，已為您切換至台南市中心';
        }
        setGpsError(msg);
        setIsLocating(false);
      },
      geoOptions
    );
  }, []);

  // Continuous watchPosition for mobile walking or driving
  useEffect(() => {
    requestGps();

    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation((prev) => {
            // Only update if user hasn't explicitly picked a simulated spot
            if (prev.isSimulated) return prev;
            return {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp,
              isSimulated: false,
            };
          });
        },
        () => {
          // ignore watch errors silently if getCurrentPosition succeeded
        },
        { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [requestGps]);

  // Handle preset simulation selection
  const handleSelectSimulatedLocation = (preset: typeof TAINAN_LOCATION_PRESETS[0]) => {
    setUserLocation({
      lat: preset.lat,
      lng: preset.lng,
      accuracy: 10,
      isSimulated: true,
      simulatedName: preset.name,
    });
    setGpsError(null);
    setIsLocating(false);
  };

  const handleResetToRealGps = () => {
    requestGps();
  };

  // Compute distances and sort all schools from nearest to furthest
  const sortedSchools = useMemo(() => {
    return sortSchoolsByDistance(TAINAN_SCHOOLS, userLocation);
  }, [userLocation]);

  // Calculate counts per district
  const districtCounts = useMemo(() => {
    const counts: Record<District | 'all', number> = {
      all: sortedSchools.length,
      中西區: 0,
      東區: 0,
      北區: 0,
      南區: 0,
      安平區: 0,
      永康區: 0,
      新化區: 0,
    };
    sortedSchools.forEach((s) => {
      counts[s.district] = (counts[s.district] || 0) + 1;
    });
    return counts;
  }, [sortedSchools]);

  // Filter schools based on criteria
  const filteredSchools = useMemo(() => {
    return sortedSchools.filter((school) => {
      // District filter
      if (selectedDistrict !== 'all' && school.district !== selectedDistrict) {
        return false;
      }

      // Fee filter
      if (selectedFee !== 'all' && school.feeType !== selectedFee) {
        return false;
      }

      // Open today filter
      if (onlyOpenToday && !school.isOpenToday) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = school.name.toLowerCase().includes(query);
        const matchAddress = school.address.toLowerCase().includes(query);
        const matchDistrict = school.district.toLowerCase().includes(query);
        const matchLandmarks = school.nearbyLandmarks.some((l) =>
          l.toLowerCase().includes(query)
        );
        if (!matchName && !matchAddress && !matchDistrict && !matchLandmarks) {
          return false;
        }
      }

      return true;
    });
  }, [sortedSchools, selectedDistrict, selectedFee, onlyOpenToday, searchQuery]);

  // The absolute nearest school from user location
  const nearestSchool = sortedSchools[0] || null;

  // View on map action
  const handleViewOnMap = (school: SchoolWithDistance) => {
    setSelectedSchool(school);
    setViewMode('map');
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-safe-nav sm:pb-12 text-slate-900 selection:bg-indigo-100">
      {/* Top Bar Contract (1 row, 3 zones) */}
      <Navbar
        onOpenTips={() => setShowTipsModal(true)}
        onRefreshGps={requestGps}
        isLocating={isLocating}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5">
        {/* Real-time Location Banner */}
        <LocationBanner
          userLocation={userLocation}
          isLocating={isLocating}
          gpsError={gpsError}
          onRefreshGps={requestGps}
          onSelectSimulatedLocation={handleSelectSimulatedLocation}
          onResetToRealGps={handleResetToRealGps}
        />

        {/* Section 1: Closest School Hero Card */}
        {nearestSchool && (
          <section className="mb-6">
            <NearestHeroCard
              school={nearestSchool}
              userLocation={userLocation}
              onViewOnMap={handleViewOnMap}
            />
          </section>
        )}

        {/* Section 2: Filters, District Tabs & Search */}
        <FilterBar
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          districtCounts={districtCounts}
          selectedFee={selectedFee}
          onSelectFee={setSelectedFee}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onlyOpenToday={onlyOpenToday}
          onToggleOnlyOpenToday={() => setOnlyOpenToday((prev) => !prev)}
        />

        {/* Section 3: Main View (Map or Ranked List) */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <MapView
              schools={filteredSchools}
              userLocation={userLocation}
              selectedSchool={selectedSchool}
              onSelectSchool={setSelectedSchool}
              nearestSchool={nearestSchool}
            />

            {/* Quick list summary below map */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
                <span>點擊上方地圖標記查看各校，或切換至清單列表</span>
                <button
                  onClick={() => setViewMode('list')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  切換列表檢視 ({filteredSchools.length} 所)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* List Header Count */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
              <span>
                共找到 <strong className="text-slate-800 font-bold tabular-nums">{filteredSchools.length}</strong> 所開放停車校園
                {selectedDistrict !== 'all' && `（${selectedDistrict}）`}
              </span>
              <span>依您目前位置由近至遠排列</span>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">查無符合條件的學校</h4>
                <p className="text-xs text-slate-500 mt-1">請嘗試清除篩選或更換搜尋關鍵字</p>
                <button
                  onClick={() => {
                    setSelectedDistrict('all');
                    setSelectedFee('all');
                    setSearchQuery('');
                    setOnlyOpenToday(false);
                  }}
                  className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  清除所有篩選
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredSchools.map((school, index) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    rank={index + 1}
                    userLocation={userLocation}
                    onViewOnMap={handleViewOnMap}
                    isNearest={school.id === nearestSchool?.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer info note */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">溫馨提醒：</span>
            台南各校園臨時停車場僅供「日間臨時停車」，切勿過夜停放，請務必於每日閉門時間前駛離。如遇學校校慶、考試或校園工程，以各校門口告示為準。
          </div>
        </div>
      </main>

      {/* Sticky Bottom Thumb Zone Navigation Bar (iPhone Optimized) */}
      {nearestSchool && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-2xl transition-all">
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">最近：{nearestSchool.name}</span>
              </div>
              <div className="text-[13px] font-bold text-slate-900 tabular-nums">
                <span className="text-indigo-600">{nearestSchool.distanceFormatted}</span>
                <span className="text-slate-400 font-normal mx-1">·</span>
                <span>車程約 {nearestSchool.driveTimeMin} 分</span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href={getGoogleMapsNavigationUrl(
                  nearestSchool.lat,
                  nearestSchool.lng,
                  `${nearestSchool.name} (校園停車)`
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(15);
                }}
                className="flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>Google 導航</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Campus Parking Rules Modal */}
      <ParkingTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </div>
  );
}
