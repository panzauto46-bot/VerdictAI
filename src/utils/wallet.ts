export type WalletProviderId = 'metamask' | 'phantom' | 'browser' | 'demo';

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isPhantom?: boolean;
  providers?: EthereumProvider[];
};

interface WalletOption {
  id: WalletProviderId;
  label: string;
  description: string;
  available: boolean;
}

const ACTIVE_WALLET_PROVIDER_KEY = 'verdictai-active-wallet-provider';

function getWindowObject() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window as Window & {
    ethereum?: EthereumProvider;
    phantom?: {
      ethereum?: EthereumProvider;
    };
  };
}

function getUniqueProviders(): EthereumProvider[] {
  const win = getWindowObject();
  if (!win) {
    return [];
  }

  const providers: EthereumProvider[] = [];
  const seenProviders = new Set<EthereumProvider>();

  const addProvider = (provider: EthereumProvider | undefined) => {
    if (!provider || seenProviders.has(provider)) {
      return;
    }

    seenProviders.add(provider);
    providers.push(provider);
  };

  addProvider(win.ethereum);

  if (Array.isArray(win.ethereum?.providers)) {
    win.ethereum.providers.forEach(addProvider);
  }

  addProvider(win.phantom?.ethereum);

  return providers;
}

function getProviderForId(providerId: Exclude<WalletProviderId, 'demo'>): EthereumProvider | null {
  const providers = getUniqueProviders();

  if (providerId === 'metamask') {
    return providers.find((provider) => provider.isMetaMask && !provider.isPhantom) ?? null;
  }

  if (providerId === 'phantom') {
    return providers.find((provider) => provider.isPhantom) ?? null;
  }

  return providers[0] ?? null;
}

export function setActiveEthereumProvider(providerId: Exclude<WalletProviderId, 'demo'> | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!providerId) {
    window.localStorage.removeItem(ACTIVE_WALLET_PROVIDER_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_WALLET_PROVIDER_KEY, providerId);
}

export function getActiveEthereumProviderId(): Exclude<WalletProviderId, 'demo'> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedProvider = window.localStorage.getItem(ACTIVE_WALLET_PROVIDER_KEY);
  if (storedProvider === 'metamask' || storedProvider === 'phantom' || storedProvider === 'browser') {
    return storedProvider;
  }

  return null;
}

export function clearActiveEthereumProvider() {
  setActiveEthereumProvider(null);
}

export function getEthereumProvider(preferredProviderId?: Exclude<WalletProviderId, 'demo'>): EthereumProvider | null {
  const requestedProvider = preferredProviderId ?? getActiveEthereumProviderId();

  if (requestedProvider) {
    return getProviderForId(requestedProvider);
  }

  return getProviderForId('metamask')
    ?? getProviderForId('phantom')
    ?? getProviderForId('browser');
}

export function getWalletOptions(): WalletOption[] {
  return [
    {
      id: 'metamask',
      label: 'MetaMask',
      description: 'Best option for GenLayer and EVM wallet flows.',
      available: Boolean(getProviderForId('metamask')),
    },
    {
      id: 'phantom',
      label: 'Phantom',
      description: 'Available if Phantom EVM is installed. Network support may vary.',
      available: Boolean(getProviderForId('phantom')),
    },
    {
      id: 'browser',
      label: 'Browser Wallet',
      description: 'Use the default injected wallet detected by the browser.',
      available: Boolean(getProviderForId('browser')),
    },
    {
      id: 'demo',
      label: 'Demo Wallet',
      description: 'Use a local demo address without a browser wallet.',
      available: true,
    },
  ];
}

export function getWalletModeLabel(walletMode: WalletProviderId | null): string {
  switch (walletMode) {
    case 'metamask':
      return 'MetaMask';
    case 'phantom':
      return 'Phantom';
    case 'browser':
      return 'Browser';
    case 'demo':
      return 'Demo';
    default:
      return 'Wallet';
  }
}

export function buildDemoWalletAddress(): string {
  const bytes = new Uint8Array(20);
  window.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
}

export function shortenAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
