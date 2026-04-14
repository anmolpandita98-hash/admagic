"use server";
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOffer(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const destinationUrl = formData.get('destinationUrl') as string;
  const revenue = parseFloat(formData.get('revenue') as string);
  const payout = parseFloat(formData.get('payout') as string);

  await prisma.offer.create({
    data: {
      tenantId: session.tenantId,
      name,
      destinationUrl,
      revenue,
      payout,
    }
  });

  revalidatePath('/dashboard/offers');
}
