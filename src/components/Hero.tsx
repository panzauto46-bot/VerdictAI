import { motion } from 'framer-motion';
import { Scale, Zap, Shield, Globe } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

function HeroOrbitalVisual() {
  const particles = [
    { top: '14%', left: '62%', delay: 0.1, duration: 5.5 },
    { top: '26%', left: '18%', delay: 0.8, duration: 6.2 },
    { top: '36%', left: '76%', delay: 0.3, duration: 5.9 },
    { top: '58%', left: '12%', delay: 1.1, duration: 6.7 },
    { top: '68%', left: '68%', delay: 0.5, duration: 5.8 },
    { top: '82%', left: '34%', delay: 0.9, duration: 6.4 },
  ];

  return (
    <div className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 xl:block">
      <motion.div
        initial={{ opacity: 0, x: 28, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="relative h-[420px] w-[420px]"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/12 to-white/0 blur-3xl" />

        <motion.div
          className="absolute inset-8 rounded-full border border-white/20 [transform:rotateX(68deg)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-12 rounded-full border border-white/16 [transform:rotateX(68deg)_rotateY(62deg)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-16 rounded-full border border-white/14 [transform:rotateX(68deg)_rotateY(-58deg)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        />

        {particles.map((particle, index) => (
          <motion.span
            key={index}
            className="absolute block h-2 w-2 rounded-full bg-white/70"
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -8, 0], opacity: [0.45, 0.95, 0.45] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/65 shadow-[0_0_42px_rgba(255,255,255,0.18)]"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
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

      <HeroOrbitalVisual />

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
