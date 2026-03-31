import { Scale, Menu, X, LogOut, Wallet, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getWalletModeLabel, getWalletOptions, shortenAddress, type WalletProviderId } from '../utils/wallet';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  walletAddress: string | null;
  walletMode: WalletProviderId | null;
  onConnectWallet: (providerId: WalletProviderId) => void | Promise<void>;
  onDisconnectWallet: () => void;
  isConnectingWallet?: boolean;
}

export default function Header({
  currentPage,
  onNavigate,
  walletAddress,
  walletMode,
  onConnectWallet,
  onDisconnectWallet,
  isConnectingWallet = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const walletOptions = getWalletOptions();

  const publicNavItems = [
    { id: 'how-it-works', label: 'How It Works', isAnchor: true },
    { id: 'demo', label: 'Live Demo', isAnchor: true },
    { id: 'features', label: 'Features', isAnchor: true },
  ];

  const appNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'submit', label: 'Submit Dispute' },
  ];

  const navItems = walletAddress ? appNavItems : publicNavItems;

  const handleNavClick = (item: { id: string, isAnchor?: boolean }) => {
    if (item.isAnchor) {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(item.id);
    }
  };

  const connectedWalletLabel = getWalletModeLabel(walletMode);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Verdict<span className="text-violet-400">AI</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center gap-4 relative">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div
                  title={walletMode === 'demo' ? 'Connected via demo wallet mode.' : `Connected through ${connectedWalletLabel}.`}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-lg"
                >
                  {walletMode ? `${connectedWalletLabel} ` : ''}
                  {shortenAddress(walletAddress)}
                </div>
                <button
                  type="button"
                  onClick={onDisconnectWallet}
                  title="Disconnect Wallet"
                  className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-red-400 border border-slate-700 text-slate-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setWalletPickerOpen((currentState) => !currentState)}
                  disabled={isConnectingWallet}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-violet-500/25"
                >
                  {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {walletPickerOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[60] w-80 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-white">Choose Wallet</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Pick the wallet you want VerdictAI to use.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {walletOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            void onConnectWallet(option.id);
                            setWalletPickerOpen(false);
                          }}
                          disabled={!option.available || isConnectingWallet}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-left transition-all hover:border-violet-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-slate-800 p-2 text-violet-300">
                              <Wallet className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-white">{option.label}</div>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] ${option.available ? 'bg-emerald-500/15 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>
                                  {option.available ? 'Available' : 'Not detected'}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <p className="mt-3 text-[11px] text-slate-500">
                      MetaMask is recommended for GenLayer.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                    currentPage === item.id
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {walletAddress ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-lg">
                    {walletMode === 'demo' ? 'Demo ' : ''}
                    {shortenAddress(walletAddress)}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onDisconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                    title="Disconnect Wallet"
                    className="p-3 bg-slate-800 hover:bg-slate-700 hover:text-red-400 border border-slate-700 text-slate-400 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => setWalletPickerOpen((currentState) => !currentState)}
                    disabled={isConnectingWallet}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg"
                  >
                    {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {walletPickerOpen && (
                    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      {walletOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            void onConnectWallet(option.id);
                            setWalletPickerOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          disabled={!option.available || isConnectingWallet}
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-left text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{option.label}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] ${option.available ? 'bg-emerald-500/15 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>
                              {option.available ? 'Available' : 'Not detected'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
