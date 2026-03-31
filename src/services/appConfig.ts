const DEFAULT_IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
const DEFAULT_STUDIONET_CONTRACT_ADDRESS = '0x82dF22192e2a54805bEa3737EAF29F3A717AfC95';
const KNOWN_INVALID_STUDIONET_ADDRESS = '0x66243CF5339D9Fd51117a27D1be890aEBf95d633';

function parseBoolean(value: string | undefined): boolean {
  return value === 'true';
}

function parseJson<T>(value: string | undefined): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeGenLayerEndpoint(value: string | undefined): string {
  if (!value) {
    return '';
  }

  const trimmedValue = trimTrailingSlash(value);

  try {
    const url = new URL(trimmedValue);
    const isStudioHost = url.hostname === 'studio.genlayer.com';

    if (isStudioHost && (url.pathname === '' || url.pathname === '/')) {
      url.pathname = '/api';
    }

    return trimTrailingSlash(url.toString());
  } catch {
    return trimmedValue;
  }
}

function normalizeGenLayerContractAddress(value: string | undefined, legacyValue: string | undefined, chain: string): string {
  const configuredAddress = (value ?? legacyValue ?? '').trim();

  if (!configuredAddress) {
    return chain === 'studionet' ? DEFAULT_STUDIONET_CONTRACT_ADDRESS : '';
  }

  if (configuredAddress.toLowerCase() === KNOWN_INVALID_STUDIONET_ADDRESS.toLowerCase()) {
    return DEFAULT_STUDIONET_CONTRACT_ADDRESS;
  }

  return configuredAddress;
}

const configuredChain = import.meta.env.VITE_GENLAYER_CHAIN ?? 'studionet';

export const appConfig = {
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  ipfsGatewayBaseUrl: trimTrailingSlash(import.meta.env.VITE_IPFS_GATEWAY_URL ?? DEFAULT_IPFS_GATEWAY),
  txExplorerBaseUrl: import.meta.env.VITE_TX_EXPLORER_URL
    ? trimTrailingSlash(import.meta.env.VITE_TX_EXPLORER_URL)
    : '',
  genLayerChain: configuredChain,
  genLayerEndpoint: normalizeGenLayerEndpoint(import.meta.env.VITE_GENLAYER_ENDPOINT),
  genLayerContractAddress: normalizeGenLayerContractAddress(
    import.meta.env.VITE_GENLAYER_CONTRACT_ADDRESS,
    import.meta.env.VITE_VERDICTAI_CONTRACT_ADDRESS,
    configuredChain
  ),
  genLayerVerdictApiUrl: import.meta.env.VITE_GENLAYER_VERDICT_API_URL
    ? trimTrailingSlash(import.meta.env.VITE_GENLAYER_VERDICT_API_URL)
    : '',
  genLayerVerdictApiKey: import.meta.env.VITE_GENLAYER_VERDICT_API_KEY ?? '',
  contractAddress: import.meta.env.VITE_VERDICTAI_CONTRACT_ADDRESS ?? '',
  contractAbi: parseJson<unknown[]>(import.meta.env.VITE_VERDICTAI_CONTRACT_ABI_JSON),
  enableContractWrites: parseBoolean(import.meta.env.VITE_VERDICTAI_ENABLE_CONTRACT_WRITES),
};

export function hasConfiguredIpfs(): boolean {
  return Boolean(appConfig.pinataJwt);
}

export function hasConfiguredContract(): boolean {
  return Boolean(appConfig.contractAddress && appConfig.contractAbi && appConfig.enableContractWrites);
}

export function hasConfiguredVerdictSource(): boolean {
  return Boolean(appConfig.genLayerVerdictApiUrl);
}

export function hasConfiguredGenLayerContract(): boolean {
  return Boolean(appConfig.genLayerContractAddress);
}
