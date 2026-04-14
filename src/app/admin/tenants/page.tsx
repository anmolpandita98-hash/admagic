import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TenantManagement() {
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          offers: true,
          affiliates: true,
          clicks: true,
          conversions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Tenant Management</h1>
        <p className="subtitle">List of all marketing agencies on Admagic</p>
      </header>

      <div className="ui-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Offers</th>
              <th>Affiliates</th>
              <th>Traffic (Clicks)</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>
                  <strong>{tenant.name}</strong>
                </td>
                <td>{tenant.email}</td>
                <td>
                  <span className={`tag ${tenant.role.toLowerCase()}`}>
                    {tenant.role}
                  </span>
                </td>
                <td>{tenant._count.offers}</td>
                <td>{tenant._count.affiliates}</td>
                <td>{tenant._count.clicks.toLocaleString()}</td>
                <td className="date-cell">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
