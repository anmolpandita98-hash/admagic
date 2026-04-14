import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CampaignListClient from './CampaignListClient';

export const dynamic = 'force-dynamic';

export default async function ManageCampaigns() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const campaigns = await prisma.campaign.findMany({
    where: { tenantId: session.tenantId },
    include: { advertiser: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize for client component
  const serialized = campaigns.map(c => ({
    id: c.id,
    title: c.title,
    advertiser: { name: c.advertiser.name },
    status: c.status,
    payout: c.payout,
    revenue: c.revenue,
    objective: c.objective,
    visibility: c.visibility,
    destinationUrl: c.destinationUrl,
  }));

  return <CampaignListClient campaigns={serialized} />;
}
