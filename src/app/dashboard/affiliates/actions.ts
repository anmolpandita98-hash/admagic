"use server";
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createAffiliate(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  await prisma.affiliate.create({
    data: {
      tenantId: session.tenantId,
      name,
      email,
    }
  });

  revalidatePath('/dashboard/affiliates');
}
