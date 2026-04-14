export interface MacroData {
  click_id: string;
  campaign_id: string;
  publisher_id: string;
  p1?: string;
  p2?: string;
  p3?: string;
}

export function expandMacros(url: string, data: MacroData): string {
  let expandedUrl = url;

  const mapping: Record<string, string | undefined> = {
    '{click_id}': data.click_id,
    '{campaign_id}': data.campaign_id,
    '{pub_id}': data.publisher_id,
    '{p1}': data.p1,
    '{p2}': data.p2,
    '{p3}': data.p3,
  };

  for (const [macro, value] of Object.entries(mapping)) {
    if (value) {
      expandedUrl = expandedUrl.split(macro).join(encodeURIComponent(value));
    }
  }

  return expandedUrl;
}
