import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Settings, Palette, Globe, Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomizePlatform() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId }
  });

  return (
    <div className="flex flex-col gap-6">
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#444' }}>Whitelabel Customization</h2>
        <button className="btn-primary">Save Changes</button>
      </div>

      <div className="grid grid-cols-2">
        <div className="ui-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontWeight: 700, color: '#444' }}>
            <Palette size={20} color="var(--primary)" />
            Branding & Aesthetics
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Platform Name</label>
              <input type="text" defaultValue={tenant?.name} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: 4 }} />
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Primary Brand Color</label>
              <div className="flex items-center gap-4">
                 <input type="color" defaultValue={tenant?.primaryColor} style={{ width: 50, height: 40, padding: 0, border: 'none' }} />
                 <span style={{ fontSize: '0.875rem', color: '#999' }}>{tenant?.primaryColor}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Upload Logo</label>
              <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#999' }}>
                <ImageIcon size={32} />
                <span style={{ fontSize: '0.875rem' }}>Drag and drop or click to upload</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ui-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontWeight: 700, color: '#444' }}>
            <Globe size={20} color="var(--primary)" />
            Domain & Tracking
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Custom Tracking Domain</label>
              <input type="text" placeholder="e.g. tracks.yourcompany.com" defaultValue={tenant?.trackingDomain || ''} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: 4 }} />
               <span style={{ fontSize: '0.75rem', color: '#999' }}>Point your CNAME to tracking.admagic.com</span>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Postback Domain</label>
              <input type="text" placeholder="e.g. api.yourcompany.com" defaultValue={tenant?.postbackDomain || ''} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
