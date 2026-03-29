const DEFAULT_IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

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

export const appConfig = {
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  ipfsGatewayBaseUrl: trimTrailingSlash(import.meta.env.VITE_IPFS_GATEWAY_URL ?? DEFAULT_IPFS_GATEWAY),
  txExplorerBaseUrl: import.meta.env.VITE_TX_EXPLORER_URL
    ? trimTrailingSlash(import.meta.env.VITE_TX_EXPLORER_URL)
    : '',
  genLayerChain: import.meta.env.VITE_GENLAYER_CHAIN ?? 'testnetBradbury',
  genLayerEndpoint: import.meta.env.VITE_GENLAYER_ENDPOINT
    ? trimTrailingSlash(import.meta.env.VITE_GENLAYER_ENDPOINT)
    : '',
  genLayerContractAddress:
    import.meta.env.VITE_GENLAYER_CONTRACT_ADDRESS ??
    import.meta.env.VITE_VERDICTAI_CONTRACT_ADDRESS ??
    '',
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
