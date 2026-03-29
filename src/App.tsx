import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import LiveDemo from './components/LiveDemo';
import Dashboard from './components/Dashboard';
import DisputeDetail from './components/DisputeDetail';
import SubmitDispute from './components/SubmitDispute';
import Footer from './components/Footer';
import { mockDisputes } from './data/mockDisputes';
import {
  Dispute,
  DisputeResponseInput,
  DisputeTransaction,
  EvidenceReference,
  NewDisputeInput,
  ServiceMode,
} from './types/dispute';
import { calculateFeeBreakdown, calculateSettlementBreakdown } from './utils/fees';
import { buildDemoWalletAddress, getEthereumProvider } from './utils/wallet';
import {
  appealVerdictAction,
  claimFundsAction,
  requestVerdictAction,
  respondToDisputeAction,
  submitDisputeAction,
} from './services/verdictaiAdapter';
import { resolveVerdict } from './services/verdictSource';

type WalletMode = 'metamask' | 'demo' | null;

const DISPUTES_STORAGE_KEY = 'verdictai-disputes';

function normalizeEvidenceReference(
  evidenceHash?: string,
  evidence?: EvidenceReference
): EvidenceReference | undefined {
  if (evidence) {
    return evidence;
  }

  if (!evidenceHash?.trim()) {
    return undefined;
  }

  const trimmedHash = evidenceHash.trim();
  const isUrl = /^https?:\/\//i.test(trimmedHash);

  return {
    hash: trimmedHash,
    url: isUrl ? trimmedHash : undefined,
    source: isUrl ? 'manual-url' : 'manual-hash',
    uploadedAt: new Date().toISOString(),
  };
}

function hydrateDispute(dispute: Dispute): Dispute {
  const partyAEvidence = normalizeEvidenceReference(dispute.partyA.evidenceHash, dispute.partyA.evidence);
  const partyBEvidence = normalizeEvidenceReference(dispute.partyB.evidenceHash, dispute.partyB.evidence);
  const fees = dispute.fees ?? calculateFeeBreakdown(
    dispute.value,
    dispute.partyA.stake,
    dispute.partyB.stake > 0 ? dispute.partyB.stake : dispute.partyA.stake
  );

  const baseDispute: Dispute = {
    ...dispute,
    fees,
    serviceMode: dispute.serviceMode ?? 'demo',
    transactions: dispute.transactions ?? [],
    partyA: {
      ...dispute.partyA,
      evidence: partyAEvidence,
      evidenceHash: partyAEvidence?.hash ?? dispute.partyA.evidenceHash,
    },
    partyB: {
      ...dispute.partyB,
      evidence: partyBEvidence,
      evidenceHash: partyBEvidence?.hash ?? dispute.partyB.evidenceHash,
    },
  };

  if (!baseDispute.verdict) {
    return baseDispute;
  }

  return {
    ...baseDispute,
    verdict: {
      ...baseDispute.verdict,
      settlement: baseDispute.verdict.settlement ?? calculateSettlementBreakdown(baseDispute),
    },
  };
}

function loadDisputes(): Dispute[] {
  if (typeof window === 'undefined') {
    return mockDisputes.map(hydrateDispute);
  }

  const storedDisputes = window.localStorage.getItem(DISPUTES_STORAGE_KEY);
  if (!storedDisputes) {
    return mockDisputes.map(hydrateDispute);
  }

  try {
    const parsedDisputes = JSON.parse(storedDisputes) as Dispute[];
    return Array.isArray(parsedDisputes) && parsedDisputes.length > 0
      ? parsedDisputes.map(hydrateDispute)
      : mockDisputes.map(hydrateDispute);
  } catch {
    return mockDisputes.map(hydrateDispute);
  }
}

function buildNextDisputeId(disputes: Dispute[]): string {
  const highestId = disputes.reduce((maxId, dispute) => {
    const match = /^DSP-(\d+)$/.exec(dispute.id);
    if (!match) {
      return maxId;
    }

    return Math.max(maxId, Number(match[1]));
  }, 0);

  return `DSP-${String(highestId + 1).padStart(3, '0')}`;
}

function buildResponseDeadline(createdAt: Date): string {
  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + 48);
  return deadline.toISOString();
}

function buildTransactionId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSuccessTransaction(
  kind: DisputeTransaction['kind'],
  label: string,
  receipt: { mode: ServiceMode; txHash: string; explorerUrl?: string; message: string }
): DisputeTransaction {
  return {
    id: buildTransactionId(),
    kind,
    status: 'success',
    mode: receipt.mode,
    label,
    txHash: receipt.txHash,
    explorerUrl: receipt.explorerUrl,
    message: receipt.message,
    createdAt: new Date().toISOString(),
  };
}

function createErrorTransaction(
  kind: DisputeTransaction['kind'],
  label: string,
  message: string,
  mode: ServiceMode = 'demo'
): DisputeTransaction {
  return {
    id: buildTransactionId(),
    kind,
    status: 'error',
    mode,
    label,
    message,
    createdAt: new Date().toISOString(),
  };
}

function determineAppealRequester(dispute: Dispute): 'A' | 'B' {
  if (!dispute.verdict) {
    return 'B';
  }

  if (dispute.verdict.winner === 'A') {
    return 'B';
  }

  if (dispute.verdict.winner === 'B') {
    return 'A';
  }

  return dispute.verdict.awardPercentage >= 50 ? 'B' : 'A';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while processing the action.';
}

// ─── Page Components ────────────────────────────────────────────────────────

function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <HowItWorks />
      <LiveDemo />
      <Features />
    </>
  );
}

function DisputeDetailPage({
  disputes,
  onNavigate,
  onRespond,
  onRequestVerdict,
  onClaimFunds,
  onAppeal,
  processingDisputeIds,
  pendingActionKeys,
  walletAddress,
}: {
  disputes: Dispute[];
  onNavigate: (page: string) => void;
  onRespond: (disputeId: string, input: DisputeResponseInput) => Promise<void>;
  onRequestVerdict: (disputeId: string, sourceDispute?: Dispute) => Promise<void>;
  onClaimFunds: (disputeId: string) => Promise<void>;
  onAppeal: (disputeId: string) => Promise<void>;
  processingDisputeIds: string[];
  pendingActionKeys: string[];
  walletAddress: string | null;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispute = disputes.find((d) => d.id === id) ?? null;

  if (!dispute) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Dispute Not Found</h2>
          <p className="text-slate-400 mb-6">The dispute you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <DisputeDetail
      dispute={dispute}
      onBack={() => navigate('/dashboard')}
      onRespond={onRespond}
      onRequestVerdict={onRequestVerdict}
      onClaimFunds={onClaimFunds}
      onAppeal={onAppeal}
      isProcessingVerdict={processingDisputeIds.includes(dispute.id)}
      isSubmittingResponse={pendingActionKeys.includes(`${dispute.id}:respond`)}
      isClaimingFunds={pendingActionKeys.includes(`${dispute.id}:claimFunds`)}
      isAppealing={pendingActionKeys.includes(`${dispute.id}:appealVerdict`)}
      walletAddress={walletAddress}
    />
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>(() => loadDisputes());
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletMode, setWalletMode] = useState<WalletMode>(null);
  const [processingDisputeIds, setProcessingDisputeIds] = useState<string[]>([]);
  const [pendingActionKeys, setPendingActionKeys] = useState<string[]>([]);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(disputes));
  }, [disputes]);

  const startPendingAction = (key: string) => {
    setPendingActionKeys((currentKeys) => (
      currentKeys.includes(key) ? currentKeys : [...currentKeys, key]
    ));
  };

  const stopPendingAction = (key: string) => {
    setPendingActionKeys((currentKeys) => currentKeys.filter((currentKey) => currentKey !== key));
  };

  const appendTransactionToDispute = (disputeId: string, transaction: DisputeTransaction) => {
    setDisputes((currentDisputes) => currentDisputes.map((entry) => (
      entry.id === disputeId
        ? {
            ...entry,
            transactions: [transaction, ...(entry.transactions ?? [])],
          }
        : entry
    )));
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'dashboard') {
      navigate('/dashboard');
    } else if (page === 'submit') {
      navigate('/submit');
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDispute = (id: string) => {
    navigate(`/dispute/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalizeVerdictProcessing = async (disputeId: string, appeal: boolean) => {
    const currentDispute = disputes.find((entry) => entry.id === disputeId);
    if (!currentDispute) {
      setProcessingDisputeIds((currentIds) => currentIds.filter((currentId) => currentId !== disputeId));
      stopPendingAction(`${disputeId}:requestVerdict`);
      return;
    }

    try {
      if (!appeal) {
        await new Promise((resolve) => window.setTimeout(resolve, 2200));
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 2800));
      }

      const result = await resolveVerdict(currentDispute, { appeal });

      setDisputes((currentDisputes) => currentDisputes.map((entry) => {
        if (entry.id !== disputeId) {
          return entry;
        }

        return hydrateDispute({
          ...entry,
          status: 'verdict',
          appealUsed: entry.appealUsed || appeal,
          serviceMode: result.source === 'remote' && entry.serviceMode === 'demo'
            ? 'wallet'
            : entry.serviceMode,
          verdict: result.verdict,
        });
      }));
    } catch (error) {
      appendTransactionToDispute(
        disputeId,
        createErrorTransaction(
          'requestVerdict',
          'Verdict source failed',
          getErrorMessage(error),
          currentDispute.serviceMode ?? 'demo'
        )
      );
    } finally {
      setProcessingDisputeIds((currentIds) => currentIds.filter((currentId) => currentId !== disputeId));
      stopPendingAction(`${disputeId}:requestVerdict`);
    }
  };

  const handleConnectWallet = async () => {
    if (walletAddress || isConnectingWallet) {
      return;
    }

    setIsConnectingWallet(true);

    try {
      const provider = getEthereumProvider();
      if (provider) {
        try {
          const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
          if (Array.isArray(accounts) && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setWalletMode('metamask');
            return;
          }
        } catch {
          // Fall back to a demo wallet if the injected provider request is rejected.
        }
      }

      setWalletAddress(buildDemoWalletAddress());
      setWalletMode('demo');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleCreateDispute = async (input: NewDisputeInput): Promise<Dispute> => {
    const disputeId = input.id ?? buildNextDisputeId(disputes);
    const pendingKey = `${disputeId}:submit`;
    startPendingAction(pendingKey);

    try {
      const receipt = await submitDisputeAction(disputeId, { ...input, id: disputeId }, walletAddress);
      const createdAt = new Date();
      const claimantEvidence = normalizeEvidenceReference(input.evidenceHash, input.evidence);
      const expectedRespondentStake = input.stakeAmount;
      const fees = calculateFeeBreakdown(input.disputeValue, input.stakeAmount, expectedRespondentStake);

      const newDispute = hydrateDispute({
        id: disputeId,
        category: input.category,
        title: input.title.trim(),
        description: input.description.trim() || 'A new dispute has been created and is now awaiting respondent input.',
        partyA: {
          address: input.claimantAddress.trim(),
          name: input.claimantName.trim(),
          claim: input.claim.trim(),
          evidenceHash: claimantEvidence?.hash,
          evidence: claimantEvidence,
          stake: input.stakeAmount,
        },
        partyB: {
          address: input.respondentAddress.trim(),
          name: input.respondentName.trim(),
          claim: 'No response has been submitted yet.',
          stake: 0,
        },
        status: 'responding',
        value: input.disputeValue,
        createdAt: createdAt.toISOString(),
        deadline: buildResponseDeadline(createdAt),
        appealUsed: false,
        fees,
        serviceMode: receipt.mode,
        transactions: [
          createSuccessTransaction('submit', 'Dispute submitted', receipt),
        ],
      });

      setDisputes((currentDisputes) => [newDispute, ...currentDisputes]);
      return newDispute;
    } finally {
      stopPendingAction(pendingKey);
    }
  };

  const handleRequestVerdict = async (disputeId: string, sourceDispute?: Dispute) => {
    const currentDispute = sourceDispute ?? disputes.find((entry) => entry.id === disputeId);
    if (!currentDispute || processingDisputeIds.includes(disputeId)) {
      return;
    }

    const pendingKey = `${disputeId}:requestVerdict`;
    const isAppealReview = currentDispute.status === 'appealed';

    startPendingAction(pendingKey);
    setProcessingDisputeIds((currentIds) => (
      currentIds.includes(disputeId) ? currentIds : [...currentIds, disputeId]
    ));

    try {
      const receipt = await requestVerdictAction(currentDispute, walletAddress);
      const reviewStartedAt = currentDispute.reviewStartedAt ?? new Date().toISOString();

      const reviewingDispute = hydrateDispute({
        ...currentDispute,
        status: isAppealReview ? 'appealed' : 'reviewing',
        reviewStartedAt,
        serviceMode: receipt.mode,
        transactions: [
          createSuccessTransaction(
            'requestVerdict',
            isAppealReview ? 'Appeal review requested' : 'AI review requested',
            receipt
          ),
          ...(currentDispute.transactions ?? []),
        ],
      });

      setDisputes((currentDisputes) => currentDisputes.map((entry) => (
        entry.id === disputeId ? reviewingDispute : entry
      )));

      void finalizeVerdictProcessing(disputeId, isAppealReview);
    } catch (error) {
      const message = getErrorMessage(error);
      appendTransactionToDispute(
        disputeId,
        createErrorTransaction('requestVerdict', 'AI review request failed', message, currentDispute.serviceMode ?? 'demo')
      );
      setProcessingDisputeIds((currentIds) => currentIds.filter((currentId) => currentId !== disputeId));
      stopPendingAction(pendingKey);
    }
  };

  const handleRespondToDispute = async (disputeId: string, input: DisputeResponseInput) => {
    const currentDispute = disputes.find((entry) => entry.id === disputeId);
    if (!currentDispute) {
      return;
    }

    const pendingKey = `${disputeId}:respond`;
    startPendingAction(pendingKey);

    try {
      const receipt = await respondToDisputeAction(currentDispute, input, walletAddress);
      const respondentEvidence = normalizeEvidenceReference(input.evidenceHash, input.evidence);
      const respondedAt = new Date().toISOString();

      const updatedDispute = hydrateDispute({
        ...currentDispute,
        status: 'reviewing',
        respondedAt,
        reviewStartedAt: respondedAt,
        fees: calculateFeeBreakdown(currentDispute.value, currentDispute.partyA.stake, input.stakeAmount),
        serviceMode: receipt.mode,
        partyB: {
          ...currentDispute.partyB,
          name: input.respondentName.trim(),
          address: input.respondentAddress.trim(),
          claim: input.claim.trim(),
          evidenceHash: respondentEvidence?.hash,
          evidence: respondentEvidence,
          stake: input.stakeAmount,
        },
        transactions: [
          createSuccessTransaction('respond', 'Respondent submitted counter-evidence', receipt),
          ...(currentDispute.transactions ?? []),
        ],
      });

      setDisputes((currentDisputes) => currentDisputes.map((entry) => (
        entry.id === disputeId ? updatedDispute : entry
      )));

      void handleRequestVerdict(disputeId, updatedDispute);
    } catch (error) {
      appendTransactionToDispute(
        disputeId,
        createErrorTransaction('respond', 'Respondent submission failed', getErrorMessage(error), currentDispute.serviceMode ?? 'demo')
      );
    } finally {
      stopPendingAction(pendingKey);
    }
  };

  const handleClaimFunds = async (disputeId: string) => {
    const currentDispute = disputes.find((entry) => entry.id === disputeId);
    if (!currentDispute) {
      return;
    }

    const pendingKey = `${disputeId}:claimFunds`;
    startPendingAction(pendingKey);

    try {
      const receipt = await claimFundsAction(currentDispute, walletAddress);
      const enforcedAt = new Date().toISOString();

      setDisputes((currentDisputes) => currentDisputes.map((entry) => (
        entry.id === disputeId
          ? hydrateDispute({
              ...entry,
              status: 'enforced',
              enforcedAt,
              serviceMode: receipt.mode,
              transactions: [
                createSuccessTransaction('claimFunds', 'Funds claimed / enforcement completed', receipt),
                ...(entry.transactions ?? []),
              ],
            })
          : entry
      )));
    } catch (error) {
      appendTransactionToDispute(
        disputeId,
        createErrorTransaction('claimFunds', 'Claim funds failed', getErrorMessage(error), currentDispute.serviceMode ?? 'demo')
      );
    } finally {
      stopPendingAction(pendingKey);
    }
  };

  const handleAppealVerdict = async (disputeId: string) => {
    const currentDispute = disputes.find((entry) => entry.id === disputeId);
    if (!currentDispute || currentDispute.appealUsed || processingDisputeIds.includes(disputeId)) {
      return;
    }

    const pendingKey = `${disputeId}:appealVerdict`;
    startPendingAction(pendingKey);

    try {
      const receipt = await appealVerdictAction(currentDispute, walletAddress);
      const reviewStartedAt = new Date().toISOString();
      const appealRequestedBy = determineAppealRequester(currentDispute);

      const updatedDispute = hydrateDispute({
        ...currentDispute,
        status: 'appealed',
        reviewStartedAt,
        appealUsed: true,
        appealRequestedBy,
        serviceMode: receipt.mode,
        transactions: [
          createSuccessTransaction('appealVerdict', 'Appeal requested', receipt),
          ...(currentDispute.transactions ?? []),
        ],
      });

      setDisputes((currentDisputes) => currentDisputes.map((entry) => (
        entry.id === disputeId ? updatedDispute : entry
      )));

      void handleRequestVerdict(disputeId, updatedDispute);
    } catch (error) {
      appendTransactionToDispute(
        disputeId,
        createErrorTransaction('appealVerdict', 'Appeal request failed', getErrorMessage(error), currentDispute.serviceMode ?? 'demo')
      );
    } finally {
      stopPendingAction(pendingKey);
    }
  };

  // Determine current page name for Header
  const currentPath = window.location.pathname;
  let currentPage: string = 'home';
  if (currentPath.startsWith('/dashboard')) currentPage = 'dashboard';
  else if (currentPath.startsWith('/submit')) currentPage = 'submit';
  else if (currentPath.startsWith('/dispute')) currentPage = 'dispute';

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        walletAddress={walletAddress}
        walletMode={walletMode}
        onConnectWallet={handleConnectWallet}
        isConnectingWallet={isConnectingWallet}
      />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              disputes={disputes}
              onViewDispute={handleViewDispute}
              onNavigate={handleNavigate}
              walletAddress={walletAddress}
            />
          }
        />

        <Route
          path="/submit"
          element={
            <SubmitDispute
              onNavigate={handleNavigate}
              onCreateDispute={handleCreateDispute}
              onViewDispute={handleViewDispute}
              walletAddress={walletAddress}
              isSubmitting={pendingActionKeys.some((key) => key.endsWith(':submit'))}
            />
          }
        />

        <Route
          path="/dispute/:id"
          element={
            <DisputeDetailPage
              disputes={disputes}
              onNavigate={handleNavigate}
              onRespond={handleRespondToDispute}
              onRequestVerdict={handleRequestVerdict}
              onClaimFunds={handleClaimFunds}
              onAppeal={handleAppealVerdict}
              processingDisputeIds={processingDisputeIds}
              pendingActionKeys={pendingActionKeys}
              walletAddress={walletAddress}
            />
          }
        />

        {/* Fallback to home */}
        <Route path="*" element={<HomePage onNavigate={handleNavigate} />} />
      </Routes>

      <Footer />
    </div>
  );
}
