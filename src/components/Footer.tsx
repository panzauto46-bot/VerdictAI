import { Scale, FileText, MessageCircle, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Scale className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                Verdict<span className="text-zinc-400">AI</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm mb-4">
              Decentralized AI-powered dispute resolution built on GenLayer.
              Trustless, fair, and permanently enforced on-chain.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </span>
              <span className="text-zinc-400 transition-colors">
                <Code className="w-5 h-5" />
              </span>
              <span className="text-zinc-400 transition-colors">
                <FileText className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-zinc-400">How it Works</span></li>
              <li><span className="text-zinc-400">Dispute Categories</span></li>
              <li><span className="text-zinc-400">Pricing</span></li>
              <li><span className="text-zinc-400">API Docs</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-zinc-400">Documentation</span></li>
              <li><span className="text-zinc-400">GenLayer Docs</span></li>
              <li><span className="text-zinc-400">Smart Contract</span></li>
              <li><span className="text-zinc-400">FAQ</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">(c) 2026 VerdictAI. Built for GenLayer Bradbury Hackathon.</p>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">Powered by</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1 bg-zinc-900 text-zinc-200 text-sm font-medium">
              GenLayer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
