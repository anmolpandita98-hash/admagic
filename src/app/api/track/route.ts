import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const offerId = url.searchParams.get('offer');
    const affiliateId = url.searchParams.get('aff');

    if (!offerId || !affiliateId) {
      return NextResponse.json({ error: 'Missing offer or aff parameter' }, { status: 400 });
    }

    // Validate offer and affiliate exist, and belong to the same tenant (simple check)
    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    const affiliate = await prisma.affiliate.findUnique({ where: { id: affiliateId } });

    if (!offer || !affiliate || offer.tenantId !== affiliate.tenantId) {
      return NextResponse.json({ error: 'Invalid tracking parameters' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Log the click
    const click = await prisma.click.create({
      data: {
        tenantId: offer.tenantId,
        offerId: offer.id,
        affiliateId: affiliate.id,
        ip,
        userAgent,
      }
    });

    // Construct destination URL with click_id for postback tracking
    const destUrl = new URL(offer.destinationUrl);
    destUrl.searchParams.set('click_id', click.id);

    return NextResponse.redirect(destUrl.toString(), 302);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
