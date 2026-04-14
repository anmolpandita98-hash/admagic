import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

export interface TargetingData {
  country?: string;
  city?: string;
  device?: string;
  os?: string;
  browser?: string;
}

export function parseRequestMetadata(ip: string, userAgent: string): TargetingData {
  const geo = geoip.lookup(ip);
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    country: geo?.country,
    city: geo?.city,
    device: result.device.type || 'Desktop',
    os: result.os.name,
    browser: result.browser.name
  };
}

export function evaluateTargeting(campaignTargeting: string | null, data: TargetingData): boolean {
  if (!campaignTargeting) return true;

  try {
    const rules = JSON.parse(campaignTargeting);
    
    // Country Check
    if (rules.countries?.length > 0 && !rules.countries.includes(data.country)) return false;
    
    // OS Check
    if (rules.os?.length > 0 && !rules.os.includes(data.os)) return false;
    
    // Device Check
    if (rules.devices?.length > 0 && !rules.devices.includes(data.device)) return false;

    return true;
  } catch (e) {
    console.error('Targeting evaluation error:', e);
    return true; // fail open
  }
}
