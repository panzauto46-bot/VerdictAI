import { motion } from 'framer-motion';
import { Scale, Zap, Shield, Globe } from 'lucide-react';
import HeroParticleField from './HeroParticleField';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Monochrome Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
        <div className="absolute top-[-120px] left-[-80px] h-[340px] w-[340px] rounded-full bg-white/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-90px] h-[320px] w-[320px] rounded-full bg-white/6 blur-3xl animate-pulse delay-1000" />
      </div>

      <HeroParticleField />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.12'%3E%3Cpath d='M0 0h52v52H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
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
            className="mb-6 text-5xl font-bold text-white md:text-7xl"
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
            className="mx-auto mb-12 max-w-3xl text-xl text-zinc-400"
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
            className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => onNavigate('submit')}
              className="rounded-xl bg-white px-8 py-4 font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-200"
            >
              Submit a Dispute
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-800"
            >
              View Dashboard
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4"
          >
            {[
              { icon: Scale, value: '47', label: 'Disputes Resolved' },
              { icon: Zap, value: '<3hrs', label: 'Avg Resolution Time' },
              { icon: Shield, value: '99.2%', label: 'Consensus Rate' },
              { icon: Globe, value: '5', label: 'AI Validators' },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-sm transition-colors hover:border-zinc-500"
              >
                <stat.icon className="mx-auto mb-3 w-8 h-8 text-zinc-300" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

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
