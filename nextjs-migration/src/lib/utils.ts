import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVisits(done: string, total: string): string {
  const doneNum = parseInt(done.split(' of ')[0]) || 0;
  const totalNum = parseInt(total) || 0;
  const percent = totalNum > 0 ? Math.round((doneNum / totalNum) * 100) : 0;
  return `${percent}%`;
}

export function formatTime(seconds: string): string {
  const num = parseInt(seconds);
  if (isNaN(num) || num === 0) return '-';
  if (num < 60) return `${num}s`;
  if (num < 3600) return `${Math.round(num / 60)}m`;
  return `${(num / 3600).toFixed(1)}h`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getCampaignTypeColor(type: string): string {
  const colors: Record<string, string> = {
    GSearch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    GMap: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    RefDVisit: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DirectVisit: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    GSearchRef: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function generateId(): string {
  return Math.floor(Math.random() * 90000000) + 10000000 + '';
}

export function generateFilename(): string {
  const n1 = Math.floor(Math.random() * 900000000) + 100000000;
  const n2 = Math.floor(Math.random() * 900000000) + 100000000;
  return `${n1}-${n2}`;
}

export function getISODate(offsetHours = 0): string {
  const d = new Date();
  d.setHours(d.getHours() + offsetHours);
  return d.toISOString();
}

export function getCreateTime(): string {
  return new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function jitter(val: string | number, percent = 0.1): number {
  const v = typeof val === 'string' ? parseInt(val) : val;
  const diff = v * percent;
  const offset = (Math.random() * diff * 2) - diff;
  return Math.floor(v + offset);
}

export function generateGeolocations(
  lat: number,
  lon: number,
  radius: number,
  count: number
): string[] {
  const points: string[] = [];
  const latRange = radius / 69;
  const lonRange = radius / (69 * Math.cos((lat * Math.PI) / 180));

  for (let i = 0; i < count; i++) {
    const rLat = lat + (Math.random() * latRange * 2 - latRange);
    const rLon = lon + (Math.random() * lonRange * 2 - lonRange);
    points.push(`${rLat.toFixed(6)}:${rLon.toFixed(6)}`);
  }

  return points;
}

export const BASE_CAMPAIGN = {
  strGoogleSearchType: 'Default',
  strMiles: '1',
  UseXMiles: true,
  UseGeolocation: true,
  strNextDevice: 'Desktop',
  AuthorId: '',
  MatchExactUrl: false,
  id: '',
  Checked: true,
  UseCustomProxy: false,
  UseGMBInteraction: false,
  UseKnowdGraphInteraction: false,
  UsePhoneNumberClick: false,
  ProjectName: '',
  Type: 'RefDVisit',
  numberOfVisits: '1000',
  doneVisits: '0 of 1000',
  doneDailyVisits: '0 of 1',
  TimeOfVisitMin: '180',
  TimeOfVisitMax: '250',
  InternalVisitsCount: '1',
  TimeOfInternalMin: '90',
  TimeOfInternalMax: '120',
  TimeOfReferrelMin: '30',
  TimeOfReferrelMax: '90',
  Threads: '',
  TimeinGooglePagesMin: '0',
  TimeinGooglePagesMax: '0',
  MaxPages: '0',
  TargetSearchEngine: '',
  TargetUrl: '',
  TargetName: '',
  CreateTime: '',
  lstUsedProxies: [],
  lstCustomProxies: [],
  lstCustomGeolocations: [],
  lstKeywords: [],
  lstSites: [],
  lstInternalIgnoreLinks: [],
  GMapRetries: '',
  GMapRetriesFails: 0,
  DailyLimit: '3',
  DailyLimitMin: '1',
  DailyLimitMax: '0',
  dtTodayDate: '',
  MinDelayAfterVisit: '1300',
  MaxDelayAfterVisit: '2000',
  DeviceType: 'Desktop',
  VisitCompetitor: false,
  strStartTime: '10:00 AM',
  strEndTime: '09:00 PM',
  strMobileUseragentPecentage: '0',
  strMobileVisits: '',
  strDesktopVisits: '',
  Keywords: [],
  UsedKeywords: [],
  Filename: '',
  nextRun: '',
  UseCustomLanguage: false,
  CustomLanguage: '',
};

export const CAMPAIGN_TYPE_CONFIGS: Record<string, Partial<typeof BASE_CAMPAIGN>> = {
  GSearch: {
    Type: 'GSearch',
    TimeinGooglePagesMin: '15',
    TimeinGooglePagesMax: '45',
    TargetSearchEngine: 'Google',
    MaxPages: '3',
    TimeOfReferrelMin: '0',
    TimeOfReferrelMax: '0',
  },
  GMap: {
    Type: 'GMap',
    UseGMBInteraction: false,
    TimeOfReferrelMin: '30',
    TimeOfReferrelMax: '90',
    TimeinGooglePagesMin: '10',
    TimeinGooglePagesMax: '30',
  },
  RefDVisit: {
    Type: 'RefDVisit',
    TimeOfReferrelMin: '30',
    TimeOfReferrelMax: '90',
    TimeinGooglePagesMin: '0',
    TimeinGooglePagesMax: '0',
  },
  GSearchRef: {
    Type: 'GSearchRef',
    TimeinGooglePagesMin: '20',
    TimeinGooglePagesMax: '60',
    TargetSearchEngine: 'Google',
    TimeOfReferrelMin: '30',
    TimeOfReferrelMax: '90',
    MaxPages: '2',
  },
  DirectVisit: {
    Type: 'DirectVisit',
    TimeOfReferrelMin: '0',
    TimeOfReferrelMax: '0',
    TimeinGooglePagesMin: '0',
    TimeinGooglePagesMax: '0',
    UseGeolocation: false,
  },
};
