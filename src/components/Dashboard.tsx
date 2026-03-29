import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Eye, Scale, TrendingUp } from 'lucide-react';
import { statusLabels, statusColors, categoryLabels, Dispute } from '../types/dispute';
import IntegrationStatus from './IntegrationStatus';

interface DashboardProps {
  disputes: Dispute[];
  onViewDispute: (id: string) => void;
  onNavigate: (page: string) => void;
  walletAddress: string | null;
}

export default function Dashboard({ disputes, onViewDispute, onNavigate, walletAddress }: DashboardProps) {
  const stats = {
    total: disputes.length,
    active: disputes.filter(d => ['open', 'responding', 'reviewing', 'appealed'].includes(d.status)).length,
    resolved: disputes.filter(d => ['verdict', 'enforced'].includes(d.status)).length,
    totalValue: disputes.reduce((acc, d) => acc + d.value, 0),
  };

  return (
    <section className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dispute Dashboard</h1>
            <p className="text-slate-400">Track and manage all disputes on VerdictAI</p>
          </div>
          <button
            onClick={() => onNavigate('submit')}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all"
          >
            + New Dispute
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Disputes</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-slate-400 text-sm">Active</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.active}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.resolved}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Value</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalValue} ETH</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <IntegrationStatus walletAddress={walletAddress} />
        </motion.div>

        {/* Disputes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">All Disputes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">ID</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Title</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Value</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Created</th>
                  <th className="text-right py-4 px-6 text-slate-400 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute, index) => (
                  <motion.tr
                    key={dispute.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="text-violet-400 font-mono text-sm">{dispute.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white text-sm line-clamp-1">{dispute.title}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300 text-sm">{categoryLabels[dispute.category]}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium text-sm">{dispute.value} ETH</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[dispute.status]}`}>
                        {statusLabels[dispute.status]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-400 text-sm">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onViewDispute(dispute.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Disputes Alert */}
        {stats.active > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-yellow-300 font-medium">Active Disputes Pending</p>
              <p className="text-yellow-400/70 text-sm mt-1">
                You have {stats.active} disputes currently in progress. AI validators are processing reviews.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
