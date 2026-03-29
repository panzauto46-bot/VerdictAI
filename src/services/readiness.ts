import {
  appConfig,
  hasConfiguredContract,
  hasConfiguredGenLayerContract,
  hasConfiguredIpfs,
  hasConfiguredVerdictSource,
} from './appConfig';
import { getEthereumProvider } from '../utils/wallet';

export type ReadinessLevel = 'ready' | 'attention' | 'missing';

export interface ReadinessItem {
  id: 'wallet' | 'ipfs' | 'verdict' | 'contract' | 'explorer';
  label: string;
  level: ReadinessLevel;
  summary: string;
  detail: string;
}

export interface ReadinessSnapshot {
  items: ReadinessItem[];
  unresolved: string[];
  readyCount: number;
}

export function getReadinessSnapshot(walletAddress: string | null): ReadinessSnapshot {
  const providerAvailable = Boolean(getEthereumProvider());
  const ipfsReady = hasConfiguredIpfs();
  const verdictReady = hasConfiguredVerdictSource();
  const genLayerContractReady = hasConfiguredGenLayerContract();
  const legacyContractReady = hasConfiguredContract();
  const explorerReady = Boolean(appConfig.txExplorerBaseUrl);

  const items: ReadinessItem[] = [
    {
      id: 'wallet',
      label: 'Wallet',
      level: walletAddress ? 'ready' : providerAvailable ? 'attention' : 'missing',
      summary: walletAddress
        ? 'Connected'
        : providerAvailable
          ? 'Provider detected'
          : 'No provider detected',
      detail: walletAddress
        ? 'The app can already create wallet-signed receipts and is ready to broadcast transactions once contract writes are configured.'
        : providerAvailable
          ? 'An injected wallet provider is available. Connect it when you are ready to run transaction-backed flows.'
          : 'Install or open an injected wallet such as MetaMask to move beyond demo mode.',
    },
    {
      id: 'ipfs',
      label: 'IPFS',
      level: ipfsReady ? 'ready' : 'attention',
      summary: ipfsReady ? 'Pinata configured' : 'Demo-local upload fallback',
      detail: ipfsReady
        ? 'Evidence uploads will pin to IPFS and store a gateway URL for later review.'
        : 'Evidence uploads still work, but files stay local to the browser session until a Pinata JWT is added.',
    },
    {
      id: 'verdict',
      label: 'Verdict Source',
      level: verdictReady ? 'ready' : 'attention',
      summary: verdictReady ? 'Remote source configured' : 'Demo verdict fallback',
      detail: verdictReady
        ? 'Verdicts can be resolved through the configured GenLayer-facing source instead of the local simulator.'
        : 'The app still resolves verdicts through the built-in demo engine until a GenLayer verdict endpoint is provided.',
    },
    {
      id: 'contract',
      label: 'Contract Writes',
      level: genLayerContractReady || legacyContractReady ? 'ready' : 'missing',
      summary:
        genLayerContractReady
          ? 'GenLayer address configured'
          : legacyContractReady
            ? 'Legacy ABI/address configured'
            : 'Awaiting contract address',
      detail:
        genLayerContractReady
          ? 'Submit/respond/verdict/claim/appeal actions can now attempt real writes through GenLayerJS on the configured chain.'
          : legacyContractReady
            ? 'A fallback ethers-style adapter is configured, but GenLayerJS remains the preferred Bradbury path.'
            : 'The adapter is prepared, but it still needs the deployed contract address. A legacy ABI JSON is only required if you use the fallback ethers-style path.',
    },
    {
      id: 'explorer',
      label: 'Explorer Links',
      level: explorerReady ? 'ready' : 'attention',
      summary: explorerReady ? 'Explorer configured' : 'Explorer not configured',
      detail: explorerReady
        ? 'Action receipts can point directly to a transaction explorer for demo verification.'
        : 'Receipts are recorded, but they cannot open an explorer until the Bradbury/testnet explorer base URL is added.',
    },
  ];

  const unresolved = items
    .filter((item) => item.level !== 'ready')
    .map((item) => `${item.label}: ${item.summary}`);

  return {
    items,
    unresolved,
    readyCount: items.filter((item) => item.level === 'ready').length,
  };
}
