import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, email, company, whatsappId, instagramId, status } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    const advertiser = await prisma.advertiser.create({
      data: {
        tenantId: session.tenantId,
        name, email,
        company: company || null,
        whatsappId: whatsappId || null,
        instagramId: instagramId || null,
        status: status || 'ACTIVE',
      },
    });

    await prisma.auditLog.create({
      data: { tenantId: session.tenantId, action: 'CREATE', entity: 'Advertiser', entityId: advertiser.id, actorEmail: session.email },
    });

    return NextResponse.json({ success: true, id: advertiser.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
