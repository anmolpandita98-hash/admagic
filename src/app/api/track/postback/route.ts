import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clickId = searchParams.get('click_id');
  const revenueParam = searchParams.get('revenue');
  const payoutParam = searchParams.get('payout');

  if (!clickId) {
    return new NextResponse('Missing click_id', { status: 400 });
  }

  // 1. Fetch the Click
  const click = await prisma.click.findUnique({
    where: { id: clickId },
    include: { campaign: true, publisher: true }
  });

  if (!click) {
    return new NextResponse('Click not found', { status: 404 });
  }

  // 2. Determine Revenue and Payout
  const revenue = revenueParam ? parseFloat(revenueParam) : click.campaign.revenue;
  const payout = payoutParam ? parseFloat(payoutParam) : click.campaign.payout;

  // 3. Create Conversion
  const conversion = await prisma.conversion.create({
    data: {
      tenantId: click.tenantId,
      campaignId: click.campaignId,
      publisherId: click.publisherId,
      clickId: click.id,
      revenue,
      payout,
    }
  });

  // 4. Publisher Postback Fan-out
  if (click.publisher.globalPostback) {
    let pbUrl = click.publisher.globalPostback
      .replace('{click_id}', click.id)
      .replace('{campaign_id}', click.campaignId)
      .replace('{payout}', payout.toString());

    // Firing postback asynchronously (fire and forget for this request)
    fetch(pbUrl).catch(err => console.error('Postback fire failed:', err));
  }

  return NextResponse.json({
    status: 'success',
    conversion_id: conversion.id
  });
}
