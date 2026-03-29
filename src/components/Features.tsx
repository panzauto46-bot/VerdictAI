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
      color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
    {
      icon: Users,
      title: 'DAO Bounty',
      description: 'Unpaid rewards, completion disagreements',
      color: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    },
    {
      icon: Image,
      title: 'NFT Sale',
      description: 'Authenticity claims, delivery issues',
      color: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
    },
    {
      icon: TrendingUp,
      title: 'DeFi',
      description: 'Oracle disputes, liquidation claims',
      color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Why VerdictAI?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
              className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-violet-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.description}</p>
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
          <p className="text-slate-400">Pre-built templates for common Web3 dispute scenarios</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${category.color} hover:scale-105 transition-transform cursor-pointer`}
            >
              <category.icon className="w-10 h-10 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-1">{category.title}</h3>
              <p className="text-sm text-slate-400">{category.description}</p>
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
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Solution</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Speed</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Cost</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Enforcement</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Decision Maker</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-slate-300">Traditional Arbitration</td>
                  <td className="text-center py-4 px-4 text-red-400">Weeks-Months</td>
                  <td className="text-center py-4 px-4 text-red-400">$1K-$50K+</td>
                  <td className="text-center py-4 px-4 text-red-400">Off-chain</td>
                  <td className="text-center py-4 px-4 text-slate-400">Centralized</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-slate-300">Kleros</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Days</td>
                  <td className="text-center py-4 px-4 text-yellow-400">$50-$500</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Token-based</td>
                  <td className="text-center py-4 px-4 text-slate-400">Human Jurors</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-slate-300">Aragon Court</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Days</td>
                  <td className="text-center py-4 px-4 text-yellow-400">$100-$1K</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Token-based</td>
                  <td className="text-center py-4 px-4 text-slate-400">Human Jurors</td>
                </tr>
                <tr className="bg-violet-500/10 rounded-lg">
                  <td className="py-4 px-4 text-white font-semibold">VerdictAI</td>
                  <td className="text-center py-4 px-4 text-emerald-400 font-semibold">Hours</td>
                  <td className="text-center py-4 px-4 text-emerald-400 font-semibold">0.5-1.5%</td>
                  <td className="text-center py-4 px-4 text-emerald-400 font-semibold">Auto On-chain</td>
                  <td className="text-center py-4 px-4 text-violet-400 font-semibold">AI Consensus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
