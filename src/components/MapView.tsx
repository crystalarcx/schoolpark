import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SchoolWithDistance, UserLocation } from '../types';
import { getGoogleMapsNavigationUrl } from '../utils/geo';
import { Navigation, MapPin, X, ExternalLink, Crosshair, ZoomIn } from 'lucide-react';

interface MapViewProps {
  schools: SchoolWithDistance[];
  userLocation: UserLocation;
  selectedSchool: SchoolWithDistance | null;
  onSelectSchool: (school: SchoolWithDistance | null) => void;
  nearestSchool: SchoolWithDistance | null;
}

export const MapView: React.FC<MapViewProps> = ({
  schools,
  userLocation,
  selectedSchool,
  onSelectSchool,
  nearestSchool,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const schoolMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const guideLineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false,
      });

      // CartoDB Voyager tiles (clean, readable for urban navigation)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control at bottom right to avoid blocking thumb reach
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Don't necessarily destroy on re-renders, clean up on unmount
    };
  }, []);

  // Update user location marker & accuracy circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userLatLng = L.latLng(userLocation.lat, userLocation.lng);

    // User marker with pulsing divIcon
    const userIcon = L.divIcon({
      className: 'user-marker-container',
      html: `<div class="user-location-pulse"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLatLng);
    } else {
      userMarkerRef.current = L.marker(userLatLng, {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }

    // Accuracy Circle
    if (userLocation.accuracy && userLocation.accuracy > 10) {
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng(userLatLng);
        accuracyCircleRef.current.setRadius(userLocation.accuracy);
      } else {
        accuracyCircleRef.current = L.circle(userLatLng, {
          radius: userLocation.accuracy,
          color: '#3b82f6',
          weight: 1,
          fillColor: '#60a5fa',
          fillOpacity: 0.15,
        }).addTo(map);
      }
    }
  }, [userLocation]);

  // Update school markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    schoolMarkersRef.current.forEach((marker) => marker.remove());
    schoolMarkersRef.current.clear();

    schools.forEach((school) => {
      const isNearest = nearestSchool?.id === school.id;
      const isSelected = selectedSchool?.id === school.id;

      // Custom HTML badge marker
      const markerHtml = `
        <div class="cursor-pointer transition-transform duration-200 transform ${
          isSelected ? 'scale-115 -translate-y-2' : 'hover:scale-105'
        }">
          <div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap border ${
            isNearest
              ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
              : school.feeType === 'free'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-indigo-600 text-white border-indigo-500'
          }">
            <span class="text-[10px]">${isNearest ? '★ 最近' : school.feeType === 'free' ? '免' : '$'}</span>
            <span class="max-w-[70px] truncate text-[11px]">${school.name}</span>
            <span class="text-[10px] opacity-90 font-mono">${school.distanceFormatted}</span>
          </div>
          <div class="w-2 h-2 mx-auto rotate-45 -mt-1 ${
            isNearest
              ? 'bg-amber-400'
              : school.feeType === 'free'
              ? 'bg-emerald-600'
              : 'bg-indigo-600'
          }"></div>
        </div>
      `;

      const schoolIcon = L.divIcon({
        className: 'school-custom-marker',
        html: markerHtml,
        iconSize: [110, 32],
        iconAnchor: [55, 32],
      });

      const marker = L.marker([school.lat, school.lng], {
        icon: schoolIcon,
        zIndexOffset: isNearest ? 800 : isSelected ? 900 : 200,
      }).addTo(map);

      marker.on('click', () => {
        onSelectSchool(school);
      });

      schoolMarkersRef.current.set(school.id, marker);
    });
  }, [schools, nearestSchool, selectedSchool]);

  // Update line connecting user to target school
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (guideLineRef.current) {
      guideLineRef.current.remove();
      guideLineRef.current = null;
    }

    const targetSchool = selectedSchool || nearestSchool;
    if (targetSchool) {
      guideLineRef.current = L.polyline(
        [
          [userLocation.lat, userLocation.lng],
          [targetSchool.lat, targetSchool.lng],
        ],
        {
          color: selectedSchool ? '#4f46e5' : '#f59e0b',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.8,
        }
      ).addTo(map);
    }
  }, [userLocation, selectedSchool, nearestSchool]);

  // Pan to selected school if changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedSchool) return;

    map.flyTo([selectedSchool.lat, selectedSchool.lng], 16, {
      duration: 0.8,
    });
  }, [selectedSchool]);

  const handleCenterUser = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.7 });
  };

  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map || schools.length === 0) return;
    const group = L.featureGroup([
      L.marker([userLocation.lat, userLocation.lng]),
      ...schools.map((s) => L.marker([s.lat, s.lng])),
    ]);
    map.fitBounds(group.getBounds().pad(0.15));
  };

  const activeSchool = selectedSchool || nearestSchool;

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        <button
          onClick={handleCenterUser}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 text-slate-800 rounded-xl shadow-md border border-slate-200 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-transform backdrop-blur-sm"
          title="定位回我的位置"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
          <span>回我的位置</span>
        </button>

        <button
          onClick={handleFitAll}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 text-slate-800 rounded-xl shadow-md border border-slate-200 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-transform backdrop-blur-sm"
          title="顯示所有學校"
        >
          <ZoomIn className="w-4 h-4 text-indigo-600" />
          <span>全部學校</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200/80 text-[11px] flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
          <span className="text-slate-700">您所在位置</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-slate-700">最近推薦</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span className="text-slate-700">免費</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
          <span className="text-slate-700">收費</span>
        </div>
      </div>

      {/* Floating Bottom Card when a school is selected or active */}
      {activeSchool && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {activeSchool.district}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    activeSchool.feeType === 'free'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {activeSchool.feeType === 'free' ? '免費停車' : '收費停車'}
                </span>
                {activeSchool.id === nearestSchool?.id && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    ★ 最近
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1">
                {activeSchool.name}
              </h4>
            </div>

            <div className="text-right">
              <div className="text-lg font-extrabold text-indigo-700 tabular-nums">
                {activeSchool.distanceFormatted}
              </div>
              <div className="text-[11px] text-slate-600">
                車程約 {activeSchool.driveTimeMin} 分鐘
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-1 mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{activeSchool.address}</span>
          </p>

          <div className="flex items-center gap-2">
            <a
              href={getGoogleMapsNavigationUrl(
                activeSchool.lat,
                activeSchool.lng,
                `${activeSchool.name} (校園停車)`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google 導航前往</span>
            </a>

            {selectedSchool && (
              <button
                onClick={() => onSelectSchool(null)}
                className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium"
              >
                關閉
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
