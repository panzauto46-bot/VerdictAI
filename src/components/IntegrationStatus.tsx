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
  ready: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  attention: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-200',
  missing: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
};

export default function IntegrationStatus({ walletAddress, compact = false }: IntegrationStatusProps) {
  const snapshot = useMemo(() => getReadinessSnapshot(walletAddress), [walletAddress]);

  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`flex flex-col gap-3 ${compact ? 'md:flex-row md:items-center md:justify-between' : 'mb-6 md:flex-row md:items-start md:justify-between'}`}>
        <div>
          <div className="flex items-center gap-2">
            {snapshot.unresolved.length === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
            <h2 className="text-lg font-semibold text-white">Integration Readiness</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {snapshot.readyCount}/{snapshot.items.length} core integration layers are configured for live demo usage.
          </p>
        </div>
        {snapshot.unresolved.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
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
                <div className="rounded-lg bg-slate-950/50 p-2">
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
