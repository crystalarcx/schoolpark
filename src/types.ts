export type District = '中西區' | '東區' | '北區' | '南區' | '安平區' | '永康區' | '新化區';

export type FeeType = 'free' | 'paid';

export interface SchoolParking {
  id: string;
  name: string;
  district: District;
  address: string;
  lat: number;
  lng: number;
  feeType: FeeType;
  feeNote: string;
  openSchedule: string;
  specialOpenNote?: string;
  nearbyLandmarks: string[];
  estimatedSpots?: number | string;
  openingHoursHint: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
  isSimulated?: boolean;
  simulatedName?: string;
}

export interface SchoolWithDistance extends SchoolParking {
  distanceKm: number;
  distanceFormatted: string;
  driveTimeMin: number;
  walkTimeMin: number;
  isOpenToday: boolean;
  openStatusText: string;
}
