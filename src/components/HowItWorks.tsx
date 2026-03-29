import { motion } from 'framer-motion';
import { FileText, Users, Brain, CheckCircle2, Coins, Shield } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Open Dispute',
      description: 'Party A submits dispute with evidence hash (IPFS), deposits stake, and locks funds in escrow.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Response Window',
      description: 'Party B receives notification and has 48 hours to submit counter-evidence and their claim.',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Brain,
      title: 'AI Review',
      description: 'GenLayer Intelligent Contract sends case to multiple LLM validators for independent analysis.',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Optimistic Democracy',
      description: "Validators reach consensus using GenLayer's Optimistic Democracy mechanism with Equivalence Principle.",
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: CheckCircle2,
      title: 'Verdict On-Chain',
      description: 'Ruling is finalized on-chain with full reasoning summary published for transparency.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Coins,
      title: 'Auto Enforcement',
      description: "Winner automatically receives escrowed funds. Loser's stake is redistributed.",
      color: 'from-emerald-500 to-green-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How VerdictAI Works</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A 6-step dispute lifecycle powered by GenLayer's decentralized AI consensus
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 hidden lg:block"
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
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-violet-500/50 transition-all group h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 border-2 border-violet-500 rounded-full flex items-center justify-center text-sm font-bold text-violet-400">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
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
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold text-white text-center mb-8">System Architecture</h3>
            <div className="flex flex-col items-center gap-4">
              {/* User */}
              <div className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 font-medium">
                User submits dispute + evidence
              </div>
              <div className="w-0.5 h-8 bg-slate-600" />

              {/* Contract */}
              <div className="px-6 py-3 bg-violet-500/20 border border-violet-500/40 rounded-lg text-violet-300 font-medium">
                VerdictAI Intelligent Contract (GenLayer)
              </div>
              <div className="w-0.5 h-8 bg-slate-600" />

              {/* Validators */}
              <div className="flex flex-wrap justify-center gap-4">
                {['LLM-A', 'LLM-B', 'LLM-C', 'LLM-D', 'LLM-E'].map((llm, i) => (
                  <div key={i} className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 text-sm font-medium">
                    {llm}
                  </div>
                ))}
              </div>
              <div className="text-slate-500 text-sm">Validators (Independent Analysis)</div>
              <div className="w-0.5 h-8 bg-slate-600" />

              {/* Consensus */}
              <div className="px-6 py-3 bg-pink-500/20 border border-pink-500/40 rounded-lg text-pink-300 font-medium">
                Optimistic Democracy Aggregation
              </div>
              <div className="w-0.5 h-8 bg-slate-600" />

              {/* Verdict */}
              <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 font-medium">
                Final Verdict - On-Chain Enforcement
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
