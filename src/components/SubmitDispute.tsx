import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Users,
  Image,
  TrendingUp,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Dispute, DisputeCategory, EvidenceReference, NewDisputeInput } from '../types/dispute';
import { getEvidenceUrl } from '../utils/evidence';
import { calculateFeeBreakdown, formatEth } from '../utils/fees';
import { buildManualEvidence, uploadEvidenceFile } from '../services/ipfs';
import { hasConfiguredIpfs } from '../services/appConfig';
import IntegrationStatus from './IntegrationStatus';

interface SubmitDisputeProps {
  onNavigate: (page: string) => void;
  onCreateDispute: (input: NewDisputeInput) => Promise<Dispute>;
  onViewDispute: (id: string) => void;
  walletAddress: string | null;
  isSubmitting: boolean;
}

export default function SubmitDispute({
  onNavigate,
  onCreateDispute,
  onViewDispute,
  walletAddress,
  isSubmitting,
}: SubmitDisputeProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<DisputeCategory | null>(null);
  const [formData, setFormData] = useState({
    claimantName: '',
    claimantAddress: '',
    title: '',
    description: '',
    claim: '',
    evidenceHash: '',
    respondentName: '',
    respondentAddress: '',
    disputeValue: '',
    stakeAmount: '',
  });
  const [uploadedEvidence, setUploadedEvidence] = useState<EvidenceReference | null>(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedDispute, setSubmittedDispute] = useState<Dispute | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    setFormData((currentFormData) => (
      currentFormData.claimantAddress
        ? currentFormData
        : {
            ...currentFormData,
            claimantAddress: walletAddress,
          }
    ));
  }, [walletAddress]);

  const feePreview = useMemo(() => {
    const disputeValue = Number.parseFloat(formData.disputeValue);
    const stakeAmount = Number.parseFloat(formData.stakeAmount);

    if (!Number.isFinite(disputeValue) || !Number.isFinite(stakeAmount)) {
      return null;
    }

    return calculateFeeBreakdown(disputeValue, stakeAmount, stakeAmount);
  }, [formData.disputeValue, formData.stakeAmount]);

  const latestReceipt = submittedDispute?.transactions?.[0];
  const uploadedEvidenceUrl = getEvidenceUrl(uploadedEvidence ?? formData.evidenceHash);

  const categories = [
    {
      id: 'freelance' as DisputeCategory,
      icon: Briefcase,
      title: 'Freelance',
      description: 'Milestone disputes, quality issues, scope disagreements',
    },
    {
      id: 'dao' as DisputeCategory,
      icon: Users,
      title: 'DAO Bounty',
      description: 'Unpaid rewards, completion disagreements',
    },
    {
      id: 'nft' as DisputeCategory,
      icon: Image,
      title: 'NFT Sale',
      description: 'Authenticity claims, delivery issues',
    },
    {
      id: 'defi' as DisputeCategory,
      icon: TrendingUp,
      title: 'DeFi',
      description: 'Oracle disputes, liquidation claims',
    },
    {
      id: 'general' as DisputeCategory,
      icon: HelpCircle,
      title: 'General',
      description: 'Custom dispute with manual evidence',
    },
  ];

  const handleUploadEvidence = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploadingEvidence(true);

    try {
      const evidence = await uploadEvidenceFile(file);
      setUploadedEvidence(evidence);
      setFormData((currentFormData) => ({
        ...currentFormData,
        evidenceHash: evidence.hash,
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Evidence upload failed.');
    } finally {
      setIsUploadingEvidence(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualEvidenceChange = (value: string) => {
    setUploadedEvidence(null);
    setFormData({ ...formData, evidenceHash: value });
  };

  const handleSubmit = async () => {
    if (!category) {
      return;
    }

    setSubmitError(null);

    try {
      const manualEvidence = !uploadedEvidence && formData.evidenceHash.trim()
        ? buildManualEvidence(formData.evidenceHash)
        : undefined;

      const createdDispute = await onCreateDispute({
        category,
        title: formData.title,
        description: formData.description,
        claimantName: formData.claimantName,
        claimantAddress: formData.claimantAddress,
        claim: formData.claim,
        evidenceHash: formData.evidenceHash,
        evidence: uploadedEvidence ?? manualEvidence,
        respondentName: formData.respondentName,
        respondentAddress: formData.respondentAddress,
        disputeValue: Number.parseFloat(formData.disputeValue),
        stakeAmount: Number.parseFloat(formData.stakeAmount),
      });

      setSubmittedDispute(createdDispute);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Dispute submission failed.');
    }
  };

  if (submittedDispute) {
    return (
      <section className="min-h-screen bg-slate-950 pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center px-4"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Dispute Submitted!</h1>
          <p className="text-slate-400 mb-8">
            Your dispute is now in the live VerdictAI flow. The respondent has 48 hours to submit their counter-evidence before AI review begins.
          </p>
          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
            <div className="text-sm text-slate-400 mb-1">Dispute ID</div>
            <div className="text-violet-400 font-mono text-lg">{submittedDispute.id}</div>
            <div className="mt-2 text-xs text-slate-500">
              Response deadline: {new Date(submittedDispute.deadline).toLocaleString()}
            </div>
            {latestReceipt && (
              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Action Receipt</div>
                <div className="text-sm text-white">{latestReceipt.label}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Mode: <span className="text-slate-200 capitalize">{latestReceipt.mode}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 break-all">{latestReceipt.txHash}</div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onViewDispute(submittedDispute.id)}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
            >
              View Dispute
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Submit a Dispute</h1>
          <p className="text-slate-400">
            Open a new dispute and let AI validators reach a fair verdict
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <IntegrationStatus walletAddress={walletAddress} compact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          {[1, 2, 3].map((progressStep) => (
            <div key={progressStep} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                progressStep < step
                  ? 'bg-violet-600 text-white'
                  : progressStep === step
                    ? 'bg-violet-600 text-white ring-4 ring-violet-600/30'
                    : 'bg-slate-800 text-slate-500'
              }`}>
                {progressStep < step ? <CheckCircle2 className="w-4 h-4" /> : progressStep}
              </div>
              {progressStep < 3 && (
                <div className={`w-12 h-0.5 ${progressStep < step ? 'bg-violet-600' : 'bg-slate-800'}`} />
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6"
        >
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Select Dispute Category</h2>
              <p className="text-slate-400 text-sm mb-6">Choose the type that best describes your dispute</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {categories.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setCategory(entry.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      category === entry.id
                        ? 'bg-violet-500/20 border-violet-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <entry.icon className={`w-8 h-8 mb-3 ${category === entry.id ? 'text-violet-400' : 'text-slate-400'}`} />
                    <h3 className="text-white font-medium mb-1">{entry.title}</h3>
                    <p className="text-slate-400 text-sm">{entry.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!category}
                className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Dispute Details</h2>
              <p className="text-slate-400 text-sm mb-6">Provide information about your dispute</p>

              <div className="space-y-4 mb-6">
                {walletAddress && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100/80">
                    Connected wallet detected. Your claimant wallet address has been prefilled for this dispute.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Name / Handle</label>
                    <input
                      type="text"
                      value={formData.claimantName}
                      onChange={(event) => setFormData({ ...formData, claimantName: event.target.value })}
                      placeholder="e.g., DevStudio Labs"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Wallet Address</label>
                    <input
                      type="text"
                      value={formData.claimantAddress}
                      onChange={(event) => setFormData({ ...formData, claimantAddress: event.target.value })}
                      placeholder="0x..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Dispute Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    placeholder="e.g., Website Development - Milestone Payment"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    placeholder="Brief overview of the dispute..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Claim Statement</label>
                  <textarea
                    value={formData.claim}
                    onChange={(event) => setFormData({ ...formData, claim: event.target.value })}
                    placeholder="Detailed explanation of your position and what you're claiming..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Evidence (IPFS Hash or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.evidenceHash}
                      onChange={(event) => handleManualEvidenceChange(event.target.value)}
                      placeholder="Qm... or https://..."
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono text-sm"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleUploadEvidence}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingEvidence}
                      className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUploadingEvidence ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {hasConfiguredIpfs()
                      ? 'Pinata IPFS upload is enabled for this workspace.'
                      : 'No Pinata JWT detected. Uploaded files will use a local demo URL until IPFS credentials are added.'}
                  </p>
                  {uploadError && (
                    <div className="mt-2 text-sm text-rose-300">{uploadError}</div>
                  )}
                  {uploadedEvidence && uploadedEvidenceUrl && (
                    <div className="mt-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-sm">
                      <div className="text-white font-medium">
                        {uploadedEvidence.fileName ?? uploadedEvidence.hash}
                      </div>
                      <div className="text-slate-400 mt-1 capitalize">
                        Evidence source: {uploadedEvidence.source.replace('-', ' ')}
                      </div>
                      <a
                        href={uploadedEvidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-violet-400 hover:underline"
                      >
                        Open evidence
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.claimantName || !formData.claimantAddress || !formData.title || !formData.claim}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Respondent & Escrow</h2>
              <p className="text-slate-400 text-sm mb-6">Identify the other party and align the fee model with the PRD</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Respondent Name / Handle</label>
                  <input
                    type="text"
                    value={formData.respondentName}
                    onChange={(event) => setFormData({ ...formData, respondentName: event.target.value })}
                    placeholder="e.g., TechCorp Inc"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Respondent Wallet Address</label>
                  <input
                    type="text"
                    value={formData.respondentAddress}
                    onChange={(event) => setFormData({ ...formData, respondentAddress: event.target.value })}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Dispute Value (ETH)</label>
                    <input
                      type="number"
                      value={formData.disputeValue}
                      onChange={(event) => setFormData({ ...formData, disputeValue: event.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Stake (ETH)</label>
                    <input
                      type="number"
                      value={formData.stakeAmount}
                      onChange={(event) => setFormData({ ...formData, stakeAmount: event.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3">PRD Fee Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Filing Fee (0.5%)</span>
                      <span className="text-white">{formatEth(feePreview?.filingFee ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Resolution Fee (1.0%)</span>
                      <span className="text-white">{formatEth(feePreview?.resolutionFee ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Protocol Dev Fee</span>
                      <span className="text-white">{formatEth(feePreview?.protocolDevFee ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Validator Reward Pool</span>
                      <span className="text-white">{formatEth(feePreview?.validatorReward ?? 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-slate-300 font-medium">Claimant Deposit at Open</span>
                      <span className="text-violet-400 font-medium">{formatEth(feePreview?.claimantDeposit ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-medium">Expected Respondent Deposit</span>
                      <span className="text-violet-400 font-medium">{formatEth(feePreview?.respondentDeposit ?? 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-300/80">
                    <strong>Important:</strong> Stakes are locked until the verdict is finalized. Filing and resolution fees follow the PRD model, and the appeal premium is only charged if the losing party escalates once.
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm text-slate-400">
                  {walletAddress
                    ? 'A connected wallet is available. Submission will use a contract-ready adapter and fall back to a wallet-signed receipt if live contract writes are not configured.'
                    : 'No wallet is connected. Submission will still work in transparent demo mode until a wallet is attached.'}
                </div>

                {submitError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {submitError}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !formData.respondentName ||
                    !formData.respondentAddress ||
                    !formData.disputeValue ||
                    !formData.stakeAmount ||
                    isSubmitting
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Dispute'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
