export type CampaignType = 'GMap' | 'GSearch' | 'DirectVisit' | 'RefDVisit' | 'GSearchRef';

export type CampaignFixture = {
  id: string;
  projectName: string;
  type: CampaignType;
  active: boolean;
};

export const previewCampaignFixtures: CampaignFixture[] = [
  {
    id: 'stub-001',
    projectName: 'Preview Plumbing Campaign',
    type: 'GMap',
    active: true,
  },
  {
    id: 'stub-002',
    projectName: 'Preview Roofing Search',
    type: 'GSearch',
    active: true,
  },
  {
    id: 'stub-003',
    projectName: 'Preview Direct Visit Seed',
    type: 'DirectVisit',
    active: false,
  },
];

export function shouldUseApiStubs(): boolean {
  if (process.env.PREVIEW_API_STUBS === '1') {
    return true;
  }

  if (process.env.PREVIEW_API_STUBS === '0') {
    return false;
  }

  const vercelEnv = process.env.VERCEL_ENV;
  return vercelEnv === 'preview' || vercelEnv === 'development' || !vercelEnv;
}
