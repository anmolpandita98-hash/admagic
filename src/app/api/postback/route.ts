import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clickId = url.searchParams.get('click_id');

    if (!clickId) {
      return NextResponse.json({ error: 'Missing click_id parameter' }, { status: 400 });
    }

    const click = await prisma.click.findUnique({
      where: { id: clickId },
      include: { offer: true }
    });

    if (!click) {
      return NextResponse.json({ error: 'Invalid click tracking ID' }, { status: 400 });
    }

    // Check for duplicate conversion (optional, but good practice)
    const existingConv = await prisma.conversion.findFirst({
      where: { clickId: click.id }
    });

    if (existingConv) {
      return NextResponse.json({ message: 'Conversion already recorded' }, { status: 200 });
    }

    // Record conversion
    await prisma.conversion.create({
      data: {
        tenantId: click.tenantId,
        offerId: click.offerId,
        affiliateId: click.affiliateId,
        clickId: click.id,
        revenue: click.offer.revenue,
        payout: click.offer.payout,
      }
    });

    return NextResponse.json({ success: true, message: 'Postback recorded successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
