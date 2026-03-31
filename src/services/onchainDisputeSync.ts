import { formatEther } from 'ethers';
import { type Dispute, type DisputeCategory, type DisputeStatus, type Verdict } from '../types/dispute';
import { hasConfiguredGenLayerContract } from './appConfig';
import { readGenLayerContract } from './genlayerClient';

interface OnChainPartySnapshot {
  address: string;
  name: string;
  claim: string;
  evidence_hash: string;
  stake: string;
}

interface OnChainVerdictSnapshot {
  winner: Verdict['winner'];
  confidence: number;
  reasoning: string;
  award_percentage: number;
  validators?: number;
  consensus_reached?: boolean;
}

interface OnChainDisputeSnapshot {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  value: string;
  response_deadline: string;
  appeal_used: boolean;
  enforced: boolean;
  party_a: OnChainPartySnapshot;
  party_b: OnChainPartySnapshot;
  verdict?: OnChainVerdictSnapshot;
  error?: string;
}

function toEthAmount(value: string | undefined): number {
  if (!value?.trim()) {
    return 0;
  }

  try {
    return Number(formatEther(BigInt(value)));
  } catch {
    return 0;
  }
}

function normalizeStatus(value: string, fallback: DisputeStatus): DisputeStatus {
  switch (value) {
    case 'open':
    case 'responding':
    case 'reviewing':
    case 'verdict':
    case 'enforced':
    case 'appealed':
      return value;
    default:
      return fallback;
  }
}

function normalizeCategory(value: string, fallback: DisputeCategory): DisputeCategory {
  switch (value) {
    case 'freelance':
    case 'dao':
    case 'nft':
    case 'defi':
    case 'general':
      return value;
    default:
      return fallback;
  }
}

function normalizeVerdict(dispute: Dispute, payload: OnChainVerdictSnapshot): Verdict {
  return {
    winner: payload.winner,
    confidence: payload.confidence,
    reasoning: payload.reasoning,
    awardPercentage: payload.award_percentage,
    validators: payload.validators ?? dispute.verdict?.validators ?? 5,
    consensusReached: payload.consensus_reached ?? true,
    timestamp: dispute.verdict?.timestamp ?? new Date().toISOString(),
    settlement: dispute.verdict?.settlement,
  };
}

export async function fetchOnChainDisputeSnapshot(disputeId: string): Promise<OnChainDisputeSnapshot | null> {
  if (!hasConfiguredGenLayerContract()) {
    return null;
  }

  const result = await readGenLayerContract('get_dispute_status', [disputeId]);
  if (typeof result !== 'string') {
    return null;
  }

  const payload = JSON.parse(result) as OnChainDisputeSnapshot;
  if (payload.error) {
    return null;
  }

  return payload;
}

export function mergeOnChainDisputeSnapshot(dispute: Dispute, snapshot: OnChainDisputeSnapshot): Dispute {
  return {
    ...dispute,
    id: snapshot.id || dispute.id,
    category: normalizeCategory(snapshot.category, dispute.category),
    title: snapshot.title || dispute.title,
    description: snapshot.description || dispute.description,
    status: normalizeStatus(snapshot.status, dispute.status),
    appealUsed: snapshot.appeal_used,
    partyA: {
      ...dispute.partyA,
      address: snapshot.party_a.address || dispute.partyA.address,
      name: snapshot.party_a.name || dispute.partyA.name,
      claim: snapshot.party_a.claim || dispute.partyA.claim,
      evidenceHash: snapshot.party_a.evidence_hash || dispute.partyA.evidenceHash,
      stake: toEthAmount(snapshot.party_a.stake),
    },
    partyB: {
      ...dispute.partyB,
      address: snapshot.party_b.address || dispute.partyB.address,
      name: snapshot.party_b.name || dispute.partyB.name,
      claim: snapshot.party_b.claim || dispute.partyB.claim,
      evidenceHash: snapshot.party_b.evidence_hash || dispute.partyB.evidenceHash,
      stake: toEthAmount(snapshot.party_b.stake),
    },
    verdict: snapshot.verdict ? normalizeVerdict(dispute, snapshot.verdict) : dispute.verdict,
  };
}
