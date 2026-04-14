import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db"
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Admagic Pro Data...')

  // 1. Create Tenant (Admin)
  const hashedPassword = await bcrypt.hash('PlatformAdmin2026!', 10)
  const tenant = await prisma.tenant.upsert({
    where: { email: 'admin@admagic.com' },
    update: {},
    create: {
      email: 'admin@admagic.com',
      name: 'Admagic Admin',
      password: hashedPassword,
      role: 'ADMIN',
      primaryColor: '#00a2e8'
    }
  })

  // 2. Create Advertisers
  const adv1 = await prisma.advertiser.create({
    data: {
      tenantId: tenant.id,
      name: 'Global Brands Ltd',
      email: 'contact@globalbrands.com',
      company: 'Global Brands',
      status: 'ACTIVE'
    }
  })

  const adv2 = await prisma.advertiser.create({
    data: {
      tenantId: tenant.id,
      name: 'Digital Growth Co',
      email: 'tech@digitalgrowth.io',
      company: 'Digital Growth',
      status: 'ACTIVE'
    }
  })

  // 3. Create Publishers
  const pub1 = await prisma.publisher.create({
    data: {
      tenantId: tenant.id,
      name: 'Ace Media',
      email: 'affiliate@acemedia.com',
      status: 'ACTIVE'
    }
  })

  const pub2 = await prisma.publisher.create({
    data: {
      tenantId: tenant.id,
      name: 'Premium Traffic',
      email: 'partners@premiumtraffic.net',
      status: 'ACTIVE'
    }
  })

  // 4. Create Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      tenantId: tenant.id,
      advertiserId: adv1.id,
      title: 'E-commerce Summer Sale',
      objective: 'CPS',
      destinationUrl: 'https://example.com/summer-sale?click_id={click_id}',
      revenue: 15.0,
      payout: 10.0,
      status: 'ACTIVE'
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      tenantId: tenant.id,
      advertiserId: adv2.id,
      title: 'Finance App Install',
      objective: 'CPI',
      destinationUrl: 'https://appstore.com/finance?sub1={click_id}',
      revenue: 4.5,
      payout: 3.0,
      status: 'ACTIVE'
    }
  })

  // 5. Generate Clicks and Conversions for Today, Yesterday, and MTD
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1))
  const mtdStart = new Date(new Date(todayStart).setDate(1))

  const timeRanges = [
    { name: 'Today', start: todayStart, count: 20 },
    { name: 'Yesterday', start: yesterdayStart, count: 45 },
    { name: 'MTD', start: mtdStart, count: 150 }
  ]

  for (const range of timeRanges) {
    console.log(`Generating ${range.count} events for ${range.name}...`)
    for (let i = 0; i < range.count; i++) {
      const isConversion = Math.random() > 0.7
      const randomHour = Math.floor(Math.random() * 24)
      const createdAt = new Date(new Date(range.start).setHours(randomHour))

      const click = await prisma.click.create({
        data: {
          tenantId: tenant.id,
          campaignId: Math.random() > 0.5 ? campaign1.id : campaign2.id,
          publisherId: Math.random() > 0.5 ? pub1.id : pub2.id,
          createdAt,
          country: 'IN',
          city: 'Mumbai',
          device: 'Mobile',
          os: 'Android',
          browser: 'Chrome'
        }
      })

      if (isConversion) {
        await prisma.conversion.create({
          data: {
            tenantId: tenant.id,
            campaignId: click.campaignId,
            publisherId: click.publisherId,
            clickId: click.id,
            revenue: click.campaignId === campaign1.id ? 15 : 4.5,
            payout: click.campaignId === campaign1.id ? 10 : 3,
            createdAt: new Date(createdAt.getTime() + 60000) // 1 min after click
          }
        })
      }
    }
  }

  console.log('✅ Seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
