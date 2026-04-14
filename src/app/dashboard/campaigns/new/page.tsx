import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CreateCampaignClient from './CreateCampaignClient';

export const dynamic = 'force-dynamic';

export default async function NewCampaignPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const advertisers = await prisma.advertiser.findMany({
    where: { tenantId: session.tenantId, status: 'ACTIVE' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return <CreateCampaignClient advertisers={advertisers} />;
}
