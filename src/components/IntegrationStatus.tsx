import { useMemo } from 'react';
import { AlertTriangle, Brain, CheckCircle2, Database, FileCode2, Link2, Wallet } from 'lucide-react';
import { getReadinessSnapshot, type ReadinessItem } from '../services/readiness';

interface IntegrationStatusProps {
  walletAddress: string | null;
  compact?: boolean;
}

const iconMap: Record<ReadinessItem['id'], typeof Wallet> = {
  wallet: Wallet,
  ipfs: Database,
  verdict: Brain,
  contract: FileCode2,
  explorer: Link2,
};

const toneMap: Record<ReadinessItem['level'], string> = {
  ready: 'border-zinc-600 bg-white/10 text-zinc-100',
  attention: 'border-zinc-700 bg-zinc-900 text-zinc-200',
  missing: 'border-zinc-800 bg-zinc-950 text-zinc-400',
};

export default function IntegrationStatus({ walletAddress, compact = false }: IntegrationStatusProps) {
  const snapshot = useMemo(() => getReadinessSnapshot(walletAddress), [walletAddress]);

  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-sm ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`flex flex-col gap-3 ${compact ? 'md:flex-row md:items-center md:justify-between' : 'mb-6 md:flex-row md:items-start md:justify-between'}`}>
        <div>
          <div className="flex items-center gap-2">
            {snapshot.unresolved.length === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-zinc-300" />
            )}
            <h2 className="text-lg font-semibold text-white">Integration Readiness</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {snapshot.readyCount}/{snapshot.items.length} core integration layers are configured for live demo usage.
          </p>
        </div>
        {snapshot.unresolved.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-sm text-zinc-300">
            Next unblocker: {snapshot.unresolved[0]}
          </div>
        )}
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'}`}>
        {snapshot.items.map((item) => {
          const Icon = iconMap[item.id];
          return (
            <div key={item.id} className={`rounded-xl border p-4 ${toneMap[item.level]}`}>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-black/50 p-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm opacity-80">{item.summary}</div>
                </div>
              </div>
              <p className="text-sm opacity-80">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
