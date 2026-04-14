import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, advertiserId, objective, destinationUrl, revenue, payout, visibility, trackingMethod, targeting } = body;

    if (!title || !advertiserId || !destinationUrl) {
      return NextResponse.json({ error: 'Title, Advertiser, and Destination URL are required.' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        tenantId: session.tenantId,
        advertiserId,
        title,
        objective: objective || 'CPA',
        destinationUrl,
        revenue: parseFloat(revenue) || 0,
        payout: parseFloat(payout) || 0,
        visibility: visibility || 'PUBLIC',
        trackingMethod: trackingMethod || 'POSTBACK',
        targeting: targeting ? JSON.stringify(targeting) : null,
        status: 'ACTIVE',
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId: session.tenantId,
        action: 'CREATE',
        entity: 'Campaign',
        entityId: campaign.id,
        actorEmail: session.email,
      },
    });

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
