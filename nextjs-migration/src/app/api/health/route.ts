import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'ctrbooster-nebula-shell',
    timestamp: new Date().toISOString(),
  });
}
