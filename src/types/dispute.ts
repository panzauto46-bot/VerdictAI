export type DisputeStatus = 'open' | 'responding' | 'reviewing' | 'verdict' | 'enforced' | 'appealed';
export type DisputeCategory = 'freelance' | 'dao' | 'nft' | 'defi' | 'general';
export type VerdictWinner = 'A' | 'B' | 'split';
export type ServiceMode = 'demo' | 'wallet' | 'contract' | 'genlayer';
export type EvidenceSource = 'manual-hash' | 'manual-url' | 'demo-local' | 'ipfs';
export type TransactionKind =
  | 'submit'
  | 'respond'
  | 'requestVerdict'
  | 'claimFunds'
  | 'appealVerdict'
  | 'uploadEvidence'
  | 'walletConnect';
export type TransactionStatus = 'pending' | 'success' | 'error';

export interface EvidenceReference {
  hash: string;
  url?: string;
  fileName?: string;
  sizeBytes?: number;
  source: EvidenceSource;
  uploadedAt?: string;
}

export interface FeeBreakdown {
  filingFee: number;
  resolutionFee: number;
  appealPremium: number;
  protocolDevFee: number;
  validatorReward: number;
  claimantDeposit: number;
  respondentDeposit: number;
}

export interface SettlementBreakdown {
  grossEscrow: number;
  principalToPartyA: number;
  principalToPartyB: number;
  claimantStakeReturn: number;
  respondentStakeReturn: number;
  redistributedStakeToWinner: number;
  burnedStake: number;
  filingFee: number;
  resolutionFee: number;
  appealPremiumApplied: number;
  protocolDevFee: number;
  validatorReward: number;
  totalToPartyA: number;
  totalToPartyB: number;
}

export interface DisputeTransaction {
  id: string;
  kind: TransactionKind;
  status: TransactionStatus;
  mode: ServiceMode;
  label: string;
  txHash?: string;
  explorerUrl?: string;
  message?: string;
  createdAt: string;
}

export interface ActionReceipt {
  mode: ServiceMode;
  txHash: string;
  explorerUrl?: string;
  message: string;
}

export interface Party {
  address: string;
  name: string;
  claim: string;
  evidenceHash?: string;
  evidence?: EvidenceReference;
  stake: number;
}

export interface Verdict {
  winner: VerdictWinner;
  confidence: number;
  reasoning: string;
  awardPercentage: number;
  validators: number;
  consensusReached: boolean;
  timestamp: string;
  settlement?: SettlementBreakdown;
}

export interface Dispute {
  id: string;
  category: DisputeCategory;
  title: string;
  description: string;
  partyA: Party;
  partyB: Party;
  status: DisputeStatus;
  value: number;
  createdAt: string;
  deadline: string;
  respondedAt?: string;
  reviewStartedAt?: string;
  enforcedAt?: string;
  appealUsed?: boolean;
  appealRequestedBy?: 'A' | 'B';
  fees?: FeeBreakdown;
  serviceMode?: ServiceMode;
  transactions?: DisputeTransaction[];
  verdict?: Verdict;
}

export interface NewDisputeInput {
  id?: string;
  category: DisputeCategory;
  title: string;
  description: string;
  claimantName: string;
  claimantAddress: string;
  claim: string;
  evidenceHash?: string;
  evidence?: EvidenceReference;
  respondentName: string;
  respondentAddress: string;
  disputeValue: number;
  stakeAmount: number;
}

export interface DisputeResponseInput {
  respondentName: string;
  respondentAddress: string;
  claim: string;
  evidenceHash?: string;
  evidence?: EvidenceReference;
  stakeAmount: number;
}

export const categoryLabels: Record<DisputeCategory, string> = {
  freelance: 'Freelance',
  dao: 'DAO Bounty',
  nft: 'NFT Sale',
  defi: 'DeFi',
  general: 'General',
};

export const statusLabels: Record<DisputeStatus, string> = {
  open: 'Open',
  responding: 'Awaiting Response',
  reviewing: 'AI Review',
  verdict: 'Verdict Reached',
  enforced: 'Enforced',
  appealed: 'Under Appeal',
};

export const statusColors: Record<DisputeStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  responding: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-purple-100 text-purple-700',
  verdict: 'bg-green-100 text-green-700',
  enforced: 'bg-emerald-100 text-emerald-700',
  appealed: 'bg-orange-100 text-orange-700',
};
