import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseRequestMetadata, evaluateTargeting } from '@/lib/targeting';
import { expandMacros } from '@/lib/macros';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('cid');
  const publisherId = searchParams.get('pid');

  if (!campaignId || !publisherId) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  // 1. Fetch Campaign and Publisher
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { advertiser: true }
  });

  if (!campaign || campaign.status !== 'ACTIVE') {
    return new NextResponse('Campaign not found or inactive', { status: 404 });
  }

  // 2. Parse Metadata & Evaluate Targeting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const ua = request.headers.get('user-agent') || '';
  const metadata = parseRequestMetadata(ip, ua);

  const isEligible = evaluateTargeting(campaign.targeting, metadata);
  if (!isEligible) {
    // In a real system, we'd redirect to a fallback URL. For now, we block or allow with a lag.
    console.log(`Targeting block for campaign ${campaignId}`);
  }

  // 3. Create Click Record
  const click = await prisma.click.create({
    data: {
      tenantId: campaign.tenantId,
      campaignId: campaign.id,
      publisherId: publisherId,
      ip,
      userAgent: ua,
      country: metadata.country,
      city: metadata.city,
      device: metadata.device,
      os: metadata.os,
      browser: metadata.browser
    }
  });

  // 4. Expand Macros & Redirect
  const finalUrl = expandMacros(campaign.destinationUrl, {
    click_id: click.id,
    campaign_id: campaign.id,
    publisher_id: publisherId,
    p1: searchParams.get('p1') || undefined,
    p2: searchParams.get('p2') || undefined,
    p3: searchParams.get('p3') || undefined,
  });

  return NextResponse.redirect(finalUrl);
}
