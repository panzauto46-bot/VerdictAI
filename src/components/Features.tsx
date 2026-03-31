import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  Scale,
  Lock,
  FileCheck,
  Repeat,
  Briefcase,
  Users,
  Image,
  TrendingUp,
} from 'lucide-react';

export default function Features() {
  const benefits = [
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Disputes resolved in hours, not weeks or months like traditional arbitration.',
    },
    {
      icon: DollarSign,
      title: 'Cost Effective',
      description: 'Only 0.5-1.5% of dispute value vs thousands in legal fees.',
    },
    {
      icon: Scale,
      title: 'Truly Fair',
      description: 'Multi-LLM consensus eliminates single-point bias and human emotion.',
    },
    {
      icon: Lock,
      title: 'Auto Enforcement',
      description: 'Verdict automatically triggers fund release via smart contract.',
    },
    {
      icon: FileCheck,
      title: 'Full Transparency',
      description: 'Every verdict with reasoning is immutable and auditable on-chain.',
    },
    {
      icon: Repeat,
      title: 'Appeal Option',
      description: 'One-time appeal with expanded validator panel for edge cases.',
    },
  ];

  const categories = [
    {
      icon: Briefcase,
      title: 'Freelance',
      description: 'Milestone disputes, scope creep, quality issues',
      color: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    },
    {
      icon: Users,
      title: 'DAO Bounty',
      description: 'Unpaid rewards, completion disagreements',
      color: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    },
    {
      icon: Image,
      title: 'NFT Sale',
      description: 'Authenticity claims, delivery issues',
      color: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    },
    {
      icon: TrendingUp,
      title: 'DeFi',
      description: 'Oracle disputes, liquidation claims',
      color: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    },
  ];

  return (
    <section id="features" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Why VerdictAI?</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            The only dispute resolution where AI consensus makes the decision -
            not gameable by token whales, not biased by emotions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-zinc-800 bg-black/70 p-6 transition-all group hover:border-zinc-500"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 transition-colors group-hover:bg-zinc-800">
                <benefit.icon className="h-6 w-6 text-zinc-200" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-zinc-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Dispute Categories</h2>
          <p className="text-zinc-400">Pre-built templates for common Web3 dispute scenarios</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`cursor-pointer rounded-xl border p-6 transition-transform hover:scale-105 ${category.color}`}
            >
              <category.icon className="w-10 h-10 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-1">{category.title}</h3>
              <p className="text-sm text-zinc-400">{category.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">VerdictAI vs Competition</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-4 px-4 text-zinc-400 font-medium">Solution</th>
                  <th className="text-center py-4 px-4 text-zinc-400 font-medium">Speed</th>
                  <th className="text-center py-4 px-4 text-zinc-400 font-medium">Cost</th>
                  <th className="text-center py-4 px-4 text-zinc-400 font-medium">Enforcement</th>
                  <th className="text-center py-4 px-4 text-zinc-400 font-medium">Decision Maker</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-4 px-4 text-zinc-300">Traditional Arbitration</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Weeks-Months</td>
                  <td className="text-center py-4 px-4 text-zinc-400">$1K-$50K+</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Off-chain</td>
                  <td className="text-center py-4 px-4 text-zinc-500">Centralized</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-4 px-4 text-zinc-300">Kleros</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Days</td>
                  <td className="text-center py-4 px-4 text-zinc-400">$50-$500</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Token-based</td>
                  <td className="text-center py-4 px-4 text-zinc-500">Human Jurors</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-4 px-4 text-zinc-300">Aragon Court</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Days</td>
                  <td className="text-center py-4 px-4 text-zinc-400">$100-$1K</td>
                  <td className="text-center py-4 px-4 text-zinc-400">Token-based</td>
                  <td className="text-center py-4 px-4 text-zinc-500">Human Jurors</td>
                </tr>
                <tr className="rounded-lg bg-white/10">
                  <td className="py-4 px-4 text-white font-semibold">VerdictAI</td>
                  <td className="text-center py-4 px-4 text-white font-semibold">Hours</td>
                  <td className="text-center py-4 px-4 text-white font-semibold">0.5-1.5%</td>
                  <td className="text-center py-4 px-4 text-white font-semibold">Auto On-chain</td>
                  <td className="text-center py-4 px-4 text-zinc-200 font-semibold">AI Consensus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
