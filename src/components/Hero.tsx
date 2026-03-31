import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Globe, Scale, Shield, User, Zap } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

function HeroVerdictFlowVisual() {
  const validators = ['A', 'B', 'C', 'D', 'E'];
  return (
    <div className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 xl:block">
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.28 }}
        className="relative h-[430px] w-[430px] overflow-hidden rounded-[30px] border border-black/15 bg-white/35 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),transparent_55%)]" />
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-black/20 bg-white/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/65">
          Verdict Flow
        </div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-6 top-24 w-[124px] rounded-xl border border-black/15 bg-white/80 p-3"
        >
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-black">Party A</div>
          <div className="text-[11px] text-black/65">Claim + Evidence</div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.7, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          className="absolute right-6 top-24 w-[124px] rounded-xl border border-black/15 bg-white/80 p-3"
        >
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-black">Party B</div>
          <div className="text-[11px] text-black/65">Counter Claim</div>
        </motion.div>

        <div className="absolute left-[125px] top-[140px] h-px w-[92px] -rotate-[18deg] bg-black/20">
          <motion.span
            className="absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-black/60"
            animate={{ x: [0, 84], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="absolute right-[125px] top-[140px] h-px w-[92px] rotate-[18deg] bg-black/20">
          <motion.span
            className="absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-black/60"
            animate={{ x: [0, 84], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.4 }}
          />
        </div>

        <motion.div
          className="absolute left-1/2 top-[168px] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-black/20 bg-black text-white"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Brain className="h-7 w-7" />
        </motion.div>
        <div className="absolute left-1/2 top-[236px] -translate-x-1/2 text-[11px] font-medium text-black/70">AI Validators</div>

        <div className="absolute left-1/2 top-[214px] h-9 w-px -translate-x-1/2 bg-black/20">
          <motion.span
            className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-black/55"
            animate={{ y: [0, 30], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          />
        </div>

        <div className="absolute left-1/2 top-[254px] flex -translate-x-1/2 items-center gap-2">
          {validators.map((validator, index) => (
            <motion.div
              key={validator}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.14 }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 bg-white/85 text-[10px] font-semibold text-black/80"
            >
              {validator}
            </motion.div>
          ))}
        </div>

        <div className="absolute left-1/2 top-[286px] h-12 w-px -translate-x-1/2 bg-black/20">
          <motion.span
            className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-black/55"
            animate={{ y: [0, 42], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />
        </div>

        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[338px] flex w-[230px] -translate-x-1/2 items-center gap-3 rounded-xl border border-black/15 bg-white/90 px-4 py-3"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-black">Verdict Finalized</div>
            <div className="text-[11px] text-black/65">On-chain enforcement</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent">
      {/* Monochrome Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/78 to-black/58" />
        <div className="absolute top-[-120px] left-[-80px] h-[340px] w-[340px] rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-90px] h-[320px] w-[320px] rounded-full bg-white/8 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.12'%3E%3Cpath d='M0 0h52v52H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Built for GenLayer Testnet
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 text-4xl font-bold text-white sm:text-6xl lg:text-7xl"
          >
            Trustless Disputes.
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              AI Consensus.
            </span>
            <br />
            On-chain Justice.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-base text-zinc-200 sm:text-lg md:text-xl"
          >
            VerdictAI is a decentralized dispute resolution protocol powered by GenLayer's Intelligent
            Contracts. Multi-LLM AI validators reach consensus on disputes - fair, fast, and
            permanently enforced on-chain.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 flex flex-col items-stretch justify-center gap-3 sm:mb-14 sm:flex-row sm:items-center sm:gap-4"
          >
            <button
              onClick={() => onNavigate('submit')}
              className="w-full rounded-xl bg-white px-8 py-4 font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-200 sm:w-auto"
            >
              Submit a Dispute
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-800 sm:w-auto"
            >
              View Dashboard
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
          >
            {[
              { icon: Scale, value: '47', label: 'Disputes Resolved' },
              { icon: Zap, value: '<3hrs', label: 'Avg Resolution Time' },
              { icon: Shield, value: '99.2%', label: 'Consensus Rate' },
              { icon: Globe, value: '5', label: 'AI Validators' },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4 backdrop-blur-sm transition-colors hover:border-zinc-500 sm:p-6"
              >
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-zinc-100 sm:mb-3" />
                <div className="mb-1 text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="text-xs text-zinc-200 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <HeroVerdictFlowVisual />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-zinc-600">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2 h-3 w-1.5 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
