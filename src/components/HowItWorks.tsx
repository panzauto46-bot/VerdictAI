import { motion } from 'framer-motion';
import { FileText, Users, Brain, CheckCircle2, Coins, Shield } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Open Dispute',
      description: 'Party A submits dispute with evidence hash (IPFS), deposits stake, and locks funds in escrow.',
    },
    {
      icon: Users,
      title: 'Response Window',
      description: 'Party B receives notification and has 48 hours to submit counter-evidence and their claim.',
    },
    {
      icon: Brain,
      title: 'AI Review',
      description: 'GenLayer Intelligent Contract sends case to multiple LLM validators for independent analysis.',
    },
    {
      icon: Shield,
      title: 'Optimistic Democracy',
      description: "Validators reach consensus using GenLayer's Optimistic Democracy mechanism with Equivalence Principle.",
    },
    {
      icon: CheckCircle2,
      title: 'Verdict On-Chain',
      description: 'Ruling is finalized on-chain with full reasoning summary published for transparency.',
    },
    {
      icon: Coins,
      title: 'Auto Enforcement',
      description: "Winner automatically receives escrowed funds. Loser's stake is redistributed.",
    },
  ];

  return (
    <section id="how-it-works" className="relative z-10 py-24 bg-black/38">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How VerdictAI Works</h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            A 6-step dispute lifecycle powered by GenLayer's decentralized AI consensus
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div
            className="absolute top-1/2 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 lg:block"
            style={{ transform: 'translateY(-50%)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-zinc-950/70 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-500 transition-all group h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black border-2 border-zinc-600 rounded-full flex items-center justify-center text-sm font-bold text-zinc-200">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-black" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
            <h3 className="text-xl font-semibold text-white text-center mb-8">System Architecture</h3>
            <div className="flex flex-col items-center gap-4">
              {/* User */}
              <div className="rounded-lg border border-zinc-600 bg-zinc-900 px-6 py-3 font-medium text-zinc-100">
                User submits dispute + evidence
              </div>
              <div className="w-0.5 h-8 bg-zinc-700" />

              {/* Contract */}
              <div className="rounded-lg border border-zinc-600 bg-zinc-900 px-6 py-3 font-medium text-zinc-100">
                VerdictAI Intelligent Contract (GenLayer)
              </div>
              <div className="w-0.5 h-8 bg-zinc-700" />

              {/* Validators */}
              <div className="flex flex-wrap justify-center gap-4">
                {['LLM-A', 'LLM-B', 'LLM-C', 'LLM-D', 'LLM-E'].map((llm, i) => (
                  <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200">
                    {llm}
                  </div>
                ))}
              </div>
              <div className="text-zinc-400 text-sm">Validators (Independent Analysis)</div>
              <div className="w-0.5 h-8 bg-zinc-700" />

              {/* Consensus */}
              <div className="rounded-lg border border-zinc-600 bg-zinc-900 px-6 py-3 font-medium text-zinc-100">
                Optimistic Democracy Aggregation
              </div>
              <div className="w-0.5 h-8 bg-zinc-700" />

              {/* Verdict */}
              <div className="rounded-lg border border-zinc-500 bg-white px-6 py-3 font-semibold text-black">
                Final Verdict - On-Chain Enforcement
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
