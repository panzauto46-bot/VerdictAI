import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CheckCircle2,
  Coins,
  ExternalLink,
  FileText,
  Flame,
  MessageSquareReply,
  ReceiptText,
  Upload,
  User,
} from 'lucide-react';
import {
  type Dispute,
  type DisputeResponseInput,
  type EvidenceReference,
  categoryLabels,
  statusColors,
  statusLabels,
} from '../types/dispute';
import { buildManualEvidence, uploadEvidenceFile } from '../services/ipfs';
import { calculateAwardBreakdown } from '../utils/disputeLifecycle';
import { getEvidenceUrl } from '../utils/evidence';
import { calculateSettlementBreakdown, formatEth } from '../utils/fees';
import { hasRespondentSubmission } from '../utils/respondentState';
import { shortenAddress } from '../utils/wallet';

interface DisputeDetailProps {
  dispute: Dispute;
  onBack: () => void;
  onRespond: (disputeId: string, input: DisputeResponseInput) => void | Promise<void>;
  onRequestVerdict: (disputeId: string) => void | Promise<void>;
  onClaimFunds: (disputeId: string) => void | Promise<void>;
  onAppeal: (disputeId: string) => void | Promise<void>;
  isProcessingVerdict: boolean;
  isSubmittingResponse: boolean;
  isClaimingFunds: boolean;
  isAppealing: boolean;
  walletAddress: string | null;
}

export default function DisputeDetail({
  dispute,
  onBack,
  onRespond,
  onRequestVerdict,
  onClaimFunds,
  onAppeal,
  isProcessingVerdict,
  isSubmittingResponse,
  isClaimingFunds,
  isAppealing,
  walletAddress,
}: DisputeDetailProps) {
  const respondentHasSubmitted = hasRespondentSubmission(dispute.partyB.claim);
  const partyAEvidenceUrl = getEvidenceUrl(dispute.partyA.evidence ?? dispute.partyA.evidenceHash);
  const partyBEvidenceUrl = getEvidenceUrl(dispute.partyB.evidence ?? dispute.partyB.evidenceHash);
  const settlement = dispute.verdict?.settlement ?? calculateSettlementBreakdown(dispute);
  const { partyAAmount, partyBAmount } = calculateAwardBreakdown(dispute);
  const responseFileInputRef = useRef<HTMLInputElement | null>(null);

  const [responseForm, setResponseForm] = useState({
    respondentName: '',
    respondentAddress: '',
    claim: '',
    evidenceHash: '',
    stakeAmount: '',
  });
  const [uploadedEvidence, setUploadedEvidence] = useState<EvidenceReference | null>(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setResponseForm({
      respondentName: dispute.partyB.name,
      respondentAddress: walletAddress ?? dispute.partyB.address,
      claim: respondentHasSubmitted ? dispute.partyB.claim : '',
      evidenceHash: dispute.partyB.evidenceHash ?? '',
      stakeAmount: dispute.partyB.stake > 0 ? String(dispute.partyB.stake) : String(dispute.partyA.stake),
    });
    setUploadedEvidence(dispute.partyB.evidence ?? null);
  }, [dispute, respondentHasSubmitted, walletAddress]);

  const showRespondForm = (dispute.status === 'open' || dispute.status === 'responding') && !respondentHasSubmitted;
  const responseEvidenceUrl = getEvidenceUrl(uploadedEvidence ?? responseForm.evidenceHash);

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
      setResponseForm((currentState) => ({ ...currentState, evidenceHash: evidence.hash }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload respondent evidence.');
    } finally {
      setIsUploadingEvidence(false);
      if (responseFileInputRef.current) {
        responseFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmitResponse = () => {
    if (
      !responseForm.respondentName.trim() ||
      !responseForm.respondentAddress.trim() ||
      !responseForm.claim.trim() ||
      !responseForm.stakeAmount.trim()
    ) {
      return;
    }

    const manualEvidence = !uploadedEvidence && responseForm.evidenceHash.trim()
      ? buildManualEvidence(responseForm.evidenceHash)
      : undefined;

    void onRespond(dispute.id, {
      respondentName: responseForm.respondentName,
      respondentAddress: responseForm.respondentAddress,
      claim: responseForm.claim,
      evidenceHash: responseForm.evidenceHash,
      evidence: uploadedEvidence ?? manualEvidence,
      stakeAmount: Number.parseFloat(responseForm.stakeAmount),
    });
  };

  const progressStep = (() => {
    switch (dispute.status) {
      case 'open':
        return 1;
      case 'responding':
        return 2;
      case 'reviewing':
        return 3;
      case 'verdict':
      case 'appealed':
        return 4;
      case 'enforced':
        return 5;
      default:
        return 1;
    }
  })();

  return (
    <section className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-violet-400 font-mono">{dispute.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[dispute.status]}`}>
                  {statusLabels[dispute.status]}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                  {dispute.serviceMode ?? 'demo'} mode
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{dispute.title}</h1>
              <p className="text-slate-400">{dispute.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-slate-400 mb-1">Dispute Value</div>
              <div className="text-3xl font-bold text-white">{dispute.value} ETH</div>
              <div className="text-sm text-slate-500">{categoryLabels[dispute.category]}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Dispute Progress</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700" />
            <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${((progressStep - 1) / 4) * 100}%` }} />
            {['Open', 'Response', 'AI Review', 'Verdict', 'Enforced'].map((stepLabel, index) => (
              <div key={stepLabel} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index + 1 <= progressStep ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-slate-800 border-2 border-slate-700'}`}>
                  {index + 1 < progressStep ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className={`text-sm font-medium ${index + 1 <= progressStep ? 'text-white' : 'text-slate-500'}`}>{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs ${index + 1 <= progressStep ? 'text-violet-400' : 'text-slate-500'}`}>{stepLabel}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { label: 'Party A (Claimant)', party: dispute.partyA, evidenceUrl: partyAEvidenceUrl, tone: 'blue' },
            { label: 'Party B (Respondent)', party: dispute.partyB, evidenceUrl: partyBEvidenceUrl, tone: 'pink' },
          ].map((entry) => (
            <motion.div
              key={entry.label}
              initial={{ opacity: 0, x: entry.tone === 'blue' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.tone === 'blue' ? 'bg-blue-500/20' : 'bg-pink-500/20'}`}>
                  <User className={`w-5 h-5 ${entry.tone === 'blue' ? 'text-blue-400' : 'text-pink-400'}`} />
                </div>
                <div>
                  <div className="text-sm text-slate-400">{entry.label}</div>
                  <div className="text-white font-medium">{entry.party.name}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-1">Wallet Address</div>
                <code className="text-violet-400 text-sm">{shortenAddress(entry.party.address)}</code>
              </div>
              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-1">{entry.label.startsWith('Party A') ? 'Claim Statement' : 'Counter Statement'}</div>
                <p className="text-slate-300 text-sm leading-relaxed">{entry.party.claim}</p>
              </div>
              {entry.party.evidenceHash && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">Evidence:</span>
                  {entry.evidenceUrl ? (
                    <a href={entry.evidenceUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline flex items-center gap-1">
                      {entry.party.evidence?.fileName ?? entry.party.evidenceHash}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-mono text-slate-300">{entry.party.evidenceHash}</span>
                  )}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-sm text-slate-400">Stake: </span>
                <span className="text-white font-medium">{entry.party.stake} ETH</span>
              </div>
            </motion.div>
          ))}
        </div>

        {showRespondForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <MessageSquareReply className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Respond to Dispute</h2>
                <p className="text-sm text-slate-400">Submit the respondent case. AI review starts automatically once this response is accepted.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={responseForm.respondentName} onChange={(event) => setResponseForm({ ...responseForm, respondentName: event.target.value })} placeholder="Respondent name / handle" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
                <input type="text" value={responseForm.respondentAddress} onChange={(event) => setResponseForm({ ...responseForm, respondentAddress: event.target.value })} placeholder="Respondent wallet address" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono" />
              </div>

              <textarea value={responseForm.claim} onChange={(event) => setResponseForm({ ...responseForm, claim: event.target.value })} rows={4} placeholder="Provide the respondent version of events..." className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none" />

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={responseForm.evidenceHash}
                      onChange={(event) => {
                        setUploadedEvidence(null);
                        setResponseForm({ ...responseForm, evidenceHash: event.target.value });
                      }}
                      placeholder="Qm... or https://..."
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                    />
                    <input ref={responseFileInputRef} type="file" className="hidden" onChange={handleUploadEvidence} />
                    <button type="button" onClick={() => responseFileInputRef.current?.click()} disabled={isUploadingEvidence} className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                      {isUploadingEvidence ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                    </button>
                  </div>
                  {responseEvidenceUrl && <a href={responseEvidenceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-violet-400 hover:underline">Open prepared evidence<ExternalLink className="w-3 h-3" /></a>}
                  {uploadError && <div className="mt-2 text-sm text-rose-300">{uploadError}</div>}
                </div>
                <input type="number" value={responseForm.stakeAmount} onChange={(event) => setResponseForm({ ...responseForm, stakeAmount: event.target.value })} placeholder="Respondent stake (ETH)" className="w-full sm:w-48 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
              </div>
            </div>

            <div className="mt-6">
              <button onClick={handleSubmitResponse} disabled={isSubmittingResponse || !responseForm.respondentName.trim() || !responseForm.respondentAddress.trim() || !responseForm.claim.trim() || !responseForm.stakeAmount.trim()} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                {isSubmittingResponse ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting response...</> : 'Submit Counter-Evidence'}
              </button>
            </div>
          </motion.div>
        )}

        {(dispute.status === 'open' || dispute.status === 'responding') && !showRespondForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-200 mb-1">Awaiting Respondent Submission</h2>
                <p className="text-sm text-yellow-100/80">Party B can submit a counter-claim and supporting evidence until {new Date(dispute.deadline).toLocaleString()}.</p>
              </div>
            </div>
          </motion.div>
        )}

        {(dispute.status === 'reviewing' || dispute.status === 'appealed') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6 bg-purple-900/20 rounded-2xl border border-purple-500/30 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
                  <Brain className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{dispute.status === 'appealed' ? 'Appeal Review in Progress' : 'AI Validators Processing'}</h2>
                  <p className="text-slate-400">{dispute.status === 'appealed' ? 'An expanded validator panel is re-evaluating the dispute under the appeal flow.' : 'Multiple LLM validators are independently analyzing the evidence and claims.'}</p>
                </div>
              </div>
              {dispute.status === 'reviewing' && !isProcessingVerdict && !dispute.verdict && (
                <button onClick={() => void onRequestVerdict(dispute.id)} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all">
                  Finalize Demo Verdict
                </button>
              )}
            </div>
          </motion.div>
        )}

        {dispute.verdict && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-gradient-to-br from-violet-900/30 to-indigo-900/30 rounded-2xl border border-violet-500/30 p-6">
            <h2 className="text-xl font-bold text-white mb-4">AI Verdict</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <div className="text-sm text-slate-400">Winner</div>
                <div className="text-xl font-bold text-white">{dispute.verdict.winner === 'split' ? 'Split' : `Party ${dispute.verdict.winner}`}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <div className="text-sm text-slate-400">Confidence</div>
                <div className="text-xl font-bold text-white">{dispute.verdict.confidence}%</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <div className="text-sm text-slate-400">Validators</div>
                <div className="text-xl font-bold text-white">{dispute.verdict.validators}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                <div className="text-sm text-slate-400">Award Share</div>
                <div className="text-xl font-bold text-white">{dispute.verdict.awardPercentage}%</div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">AI Reasoning Summary</h3>
              <p className="text-slate-300 leading-relaxed">{dispute.verdict.reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Party A Net Claim</div>
                <div className="text-2xl font-bold text-emerald-400">{formatEth(partyAAmount)}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Party B Net Claim</div>
                <div className="text-2xl font-bold text-slate-300">{formatEth(partyBAmount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Protocol Dev Fee</div>
                <div className="text-lg font-semibold text-white">{formatEth(settlement.protocolDevFee)}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Validator Reward Pool</div>
                <div className="text-lg font-semibold text-white">{formatEth(settlement.validatorReward)}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Burned Stake</div>
                <div className="text-lg font-semibold text-white">{formatEth(settlement.burnedStake)}</div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Timeline</h2>
          <div className="space-y-3 text-sm">
            <div className="text-slate-300">Created: <span className="text-slate-400">{new Date(dispute.createdAt).toLocaleString()}</span></div>
            <div className="text-slate-300">Response deadline: <span className="text-slate-400">{new Date(dispute.deadline).toLocaleString()}</span></div>
            {dispute.respondedAt && <div className="text-slate-300">Responded: <span className="text-slate-400">{new Date(dispute.respondedAt).toLocaleString()}</span></div>}
            {dispute.reviewStartedAt && <div className="text-slate-300">AI review started: <span className="text-slate-400">{new Date(dispute.reviewStartedAt).toLocaleString()}</span></div>}
            {dispute.verdict && <div className="text-slate-300">Verdict rendered: <span className="text-slate-400">{new Date(dispute.verdict.timestamp).toLocaleString()}</span></div>}
            {dispute.enforcedAt && <div className="text-slate-300">Enforced: <span className="text-slate-400">{new Date(dispute.enforcedAt).toLocaleString()}</span></div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ReceiptText className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Action Receipts</h2>
          </div>
          <div className="space-y-3">
            {(dispute.transactions ?? []).length > 0 ? (
              dispute.transactions?.map((transaction) => (
                <div key={transaction.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-white font-medium">{transaction.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${transaction.status === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{transaction.status}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 capitalize">{transaction.mode}</span>
                      </div>
                      <div className="text-sm text-slate-400">{transaction.message}</div>
                      {transaction.txHash && <div className="mt-2 break-all text-xs text-slate-500">{transaction.txHash}</div>}
                    </div>
                    <div className="text-sm text-slate-500">{new Date(transaction.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">No action receipts have been recorded yet for this dispute.</div>
            )}
          </div>
        </motion.div>

        {dispute.status === 'verdict' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 flex flex-col lg:flex-row gap-4">
            <button onClick={() => void onClaimFunds(dispute.id)} disabled={isClaimingFunds} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isClaimingFunds ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Claiming...</> : <><Coins className="w-4 h-4" />Claim Funds</>}
            </button>
            <button onClick={() => void onAppeal(dispute.id)} disabled={dispute.appealUsed || isProcessingVerdict || isAppealing} className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all border border-slate-700 flex items-center justify-center gap-2">
              {isAppealing ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Appealing...</> : <><Flame className="w-4 h-4" />{dispute.appealUsed ? 'Appeal Already Used' : 'Appeal Verdict'}</>}
            </button>
          </motion.div>
        )}

        {dispute.status === 'enforced' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-emerald-200 mb-1">Enforcement Complete</h2>
                <p className="text-sm text-emerald-100/80">The dispute has moved into the enforced state and the payout action has been recorded.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
