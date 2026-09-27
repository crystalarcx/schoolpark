import { SchoolParking, SchoolWithDistance, UserLocation } from '../types';

/**
 * Calculate great-circle distance between two points on Earth using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance cleanly: e.g. "350 公尺" or "1.4 公里"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} 公尺`;
  }
  return `${distanceKm.toFixed(1)} 公里`;
}

/**
 * Estimate driving time (assuming 24 km/h average in Tainan city with traffic signals)
 */
export function estimateDriveMinutes(distanceKm: number): number {
  const mins = Math.round((distanceKm / 24) * 60);
  return Math.max(1, mins);
}

/**
 * Estimate walking time (assuming 4.5 km/h)
 */
export function estimateWalkMinutes(distanceKm: number): number {
  const mins = Math.round((distanceKm / 4.5) * 60);
  return Math.max(1, mins);
}

/**
 * Determine if a school is open today based on day of week
 * 0 = Sunday, 6 = Saturday, 1-5 = Monday to Friday
 */
export function checkSchoolOpenToday(school: SchoolParking): {
  isOpen: boolean;
  statusText: string;
} {
  const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = today === 0 || today === 6;

  // 文元國小: 每日開放
  if (school.id === 'wenyuan-elem') {
    return {
      isOpen: true,
      statusText: '每日開放停車',
    };
  }

  // 大灣高中: 僅週日及國定假日開放
  if (school.id === 'dawan-high') {
    if (today === 0) {
      return {
        isOpen: true,
        statusText: '今日週日開放',
      };
    }
    return {
      isOpen: false,
      statusText: '僅週日及國定假日開放',
    };
  }

  // 勝利國小: 僅週六、日開放
  if (school.id === 'shengli-elem') {
    if (isWeekend) {
      return {
        isOpen: true,
        statusText: today === 6 ? '今日週六開放' : '今日週日開放',
      };
    }
    return {
      isOpen: false,
      statusText: '僅週六、日開放',
    };
  }

  // General weekend schools
  if (isWeekend) {
    return {
      isOpen: true,
      statusText: today === 6 ? '今日週六開放' : '今日週日開放',
    };
  }

  return {
    isOpen: false,
    statusText: '週末及假日開放',
  };
}

/**
 * Get cardinal direction string from point 1 to point 2
 */
export function getCompassDirection(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon * (Math.PI / 180));
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
  const index = Math.round(brng / 45) % 8;
  return directions[index];
}

/**
 * Calculate distance for all schools and sort ascending
 */
export function sortSchoolsByDistance(
  schools: SchoolParking[],
  userLocation: UserLocation
): SchoolWithDistance[] {
  return schools
    .map((school) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        school.lat,
        school.lng
      );
      const openInfo = checkSchoolOpenToday(school);
      return {
        ...school,
        distanceKm: dist,
        distanceFormatted: formatDistance(dist),
        driveTimeMin: estimateDriveMinutes(dist),
        walkTimeMin: estimateWalkMinutes(dist),
        isOpenToday: openInfo.isOpen,
        openStatusText: openInfo.statusText,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Navigation links
 */
export function getGoogleMapsNavigationUrl(
  lat: number,
  lng: number,
  label: string
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(label)}`;
}
