import { appConfig, hasConfiguredIpfs } from './appConfig';
import { EvidenceReference } from '../types/dispute';

interface PinataUploadResponse {
  IpfsHash: string;
}

function buildDemoHash(file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toLowerCase() || 'evidence';
  const seed = `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`;
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }

  return `demo-${safeName}-${hash.toString(16)}`;
}

export function buildGatewayUrl(hash: string): string {
  return `${appConfig.ipfsGatewayBaseUrl}/${hash}`;
}

export async function uploadEvidenceFile(file: File): Promise<EvidenceReference> {
  if (hasConfiguredIpfs()) {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        app: 'VerdictAI',
        uploadedAt: new Date().toISOString(),
      },
    });

    formData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${appConfig.pinataJwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('IPFS upload failed. Check your Pinata configuration and try again.');
    }

    const payload = await response.json() as PinataUploadResponse;

    return {
      hash: payload.IpfsHash,
      url: buildGatewayUrl(payload.IpfsHash),
      fileName: file.name,
      sizeBytes: file.size,
      source: 'ipfs',
      uploadedAt: new Date().toISOString(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  return {
    hash: buildDemoHash(file),
    url: objectUrl,
    fileName: file.name,
    sizeBytes: file.size,
    source: 'demo-local',
    uploadedAt: new Date().toISOString(),
  };
}

export function buildManualEvidence(value: string): EvidenceReference {
  const trimmedValue = value.trim();
  const isUrl = /^https?:\/\//i.test(trimmedValue);

  return {
    hash: trimmedValue,
    url: isUrl ? trimmedValue : buildGatewayUrl(trimmedValue),
    source: isUrl ? 'manual-url' : 'manual-hash',
    uploadedAt: new Date().toISOString(),
  };
}

