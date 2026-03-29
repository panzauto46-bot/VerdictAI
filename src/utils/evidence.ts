import { appConfig } from '../services/appConfig';
import { EvidenceReference } from '../types/dispute';

export function getEvidenceUrl(evidence?: EvidenceReference | string): string | null {
  if (!evidence) {
    return null;
  }

  if (typeof evidence !== 'string' && evidence.url) {
    return evidence.url;
  }

  const trimmed = (typeof evidence === 'string' ? evidence : evidence.hash).trim();
  if (!trimmed || trimmed.includes('...')) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^ipfs:\/\//i, '');
  return `${appConfig.ipfsGatewayBaseUrl}/${normalized}`;
}
