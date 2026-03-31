import { CheckCircle2, ClipboardCheck, ExternalLink, PlayCircle } from 'lucide-react';

interface JudgingChecklistProps {
  onNavigate: (page: string) => void;
}

const demoFlow = [
  'Connect wallet (or keep Demo Wallet mode).',
  'Submit a dispute with title, claim, evidence hash/file.',
  'Respond as Party B from dispute detail page.',
  'Request AI verdict and observe receipts + timeline.',
  'Claim funds or appeal once to show full lifecycle.',
];

const judgeChecks = [
  'All core actions produce receipts (submit/respond/verdict/claim/appeal).',
  'On-chain mode shows transaction hash + explorer link when available.',
  'UI handles insufficient balance with clear guidance + demo fallback.',
  'Dispute state transitions match lifecycle: responding -> reviewing -> verdict -> enforced.',
];

export default function JudgingChecklist({ onNavigate }: JudgingChecklistProps) {
  return (
    <section id="judging-checklist" className="relative z-10 bg-black/34 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Demo & Judging Checklist</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-200">
            A short script to help judges verify the end-to-end flow in under five minutes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-100">
              <PlayCircle className="h-5 w-5" />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">Quick Demo Script</h3>
            <ul className="space-y-2">
              {demoFlow.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 lg:col-span-2">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-100">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-white">What Judges Should Verify</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {judgeChecks.map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-sm text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-900/40 p-4 text-sm text-zinc-200">
              Tip: if the wallet has no GEN, continue using Demo Mode from submit flow so reviewers never get stuck.
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => onNavigate('submit')}
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Open Submit Flow
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Open Dashboard
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
