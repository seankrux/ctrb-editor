import { NextResponse } from 'next/server';
import { previewCampaignFixtures, shouldUseApiStubs } from '@/lib/api-fixtures';

export async function GET() {
  if (shouldUseApiStubs()) {
    return NextResponse.json({
      source: 'preview-stub',
      campaigns: previewCampaignFixtures,
    });
  }

  return NextResponse.json(
    {
      source: 'disabled',
      error: 'Preview API stubs are disabled and no backend integration is configured.',
    },
    {
      status: 503,
    }
  );
}
