import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, email, phone, globalPostback } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });
    }

    const publisher = await prisma.publisher.create({
      data: {
        tenantId: session.tenantId,
        name, email,
        phone: phone || null,
        globalPostback: globalPostback || null,
        status: 'ACTIVE',
      },
    });

    await prisma.auditLog.create({
      data: { tenantId: session.tenantId, action: 'CREATE', entity: 'Publisher', entityId: publisher.id, actorEmail: session.email },
    });

    return NextResponse.json({ success: true, id: publisher.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
