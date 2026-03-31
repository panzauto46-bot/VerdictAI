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
    <section id="how-it-works" className="relative z-10 bg-black/42 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14 lg:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">How VerdictAI Works</h2>
          <p className="mx-auto max-w-2xl text-base text-zinc-200 sm:text-lg">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="group h-full rounded-2xl border border-zinc-800 bg-zinc-950/75 p-5 backdrop-blur-sm transition-all hover:border-zinc-500 sm:p-6">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black border-2 border-zinc-600 rounded-full flex items-center justify-center text-sm font-bold text-zinc-200">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white transition-transform group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-black" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-200">{step.description}</p>
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
          className="mt-14 sm:mt-16 lg:mt-20"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-7 lg:p-8">
            <h3 className="mb-8 text-center text-xl font-semibold text-white">System Architecture</h3>
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
              <div className="text-zinc-200 text-sm">Validators (Independent Analysis)</div>
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
