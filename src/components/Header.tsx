import { Scale, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { shortenAddress } from '../utils/wallet';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  walletAddress: string | null;
  walletMode: 'metamask' | 'demo' | null;
  onConnectWallet: () => void | Promise<void>;
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

  const navItems = walletAddress
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'submit', label: 'Submit Dispute' },
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'submit', label: 'Submit Dispute' },
      ];

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
                onClick={() => onNavigate(item.id)}
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
          <div className="hidden md:flex items-center gap-4">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div
                  title={walletMode === 'demo' ? 'Connected via demo wallet mode.' : 'Connected through an injected wallet provider.'}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-lg"
                >
                  {walletMode === 'demo' ? 'Demo ' : ''}
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
              <button
                type="button"
                onClick={onConnectWallet}
                disabled={isConnectingWallet}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-violet-500/25"
              >
                {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
              </button>
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
                    onNavigate(item.id);
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
                <button
                  type="button"
                  onClick={() => {
                    void onConnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isConnectingWallet}
                  className="mt-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg"
                >
                  {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
