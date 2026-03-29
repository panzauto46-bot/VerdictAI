import { type Dispute, type Verdict } from '../types/dispute';
import { appConfig, hasConfiguredVerdictSource } from './appConfig';
import { generateDemoVerdict } from '../utils/disputeLifecycle';
import { calculateSettlementBreakdown } from '../utils/fees';

interface RemoteVerdictPayload {
  winner: Verdict['winner'];
  confidence: number;
  reasoning: string;
  awardPercentage: number;
  validators?: number;
  consensusReached?: boolean;
  timestamp?: string;
}

interface VerdictSourceResult {
  verdict: Verdict;
  source: 'demo' | 'remote';
}

function normalizeRemoteVerdict(dispute: Dispute, payload: RemoteVerdictPayload): Verdict {
  const verdict: Verdict = {
    winner: payload.winner,
    confidence: payload.confidence,
    reasoning: payload.reasoning,
    awardPercentage: payload.awardPercentage,
    validators: payload.validators ?? 5,
    consensusReached: payload.consensusReached ?? true,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  return {
    ...verdict,
    settlement: calculateSettlementBreakdown({
      ...dispute,
      verdict,
    }),
  };
}

export async function resolveVerdict(
  dispute: Dispute,
  options?: { appeal?: boolean }
): Promise<VerdictSourceResult> {
  if (!hasConfiguredVerdictSource()) {
    return {
      verdict: generateDemoVerdict(dispute, options),
      source: 'demo',
    };
  }

  const response = await fetch(appConfig.genLayerVerdictApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(appConfig.genLayerVerdictApiKey ? { Authorization: `Bearer ${appConfig.genLayerVerdictApiKey}` } : {}),
    },
    body: JSON.stringify({
      disputeId: dispute.id,
      category: dispute.category,
      title: dispute.title,
      description: dispute.description,
      appeal: options?.appeal ?? false,
      partyA: {
        name: dispute.partyA.name,
        address: dispute.partyA.address,
        claim: dispute.partyA.claim,
        evidenceHash: dispute.partyA.evidence?.hash ?? dispute.partyA.evidenceHash ?? '',
      },
      partyB: {
        name: dispute.partyB.name,
        address: dispute.partyB.address,
        claim: dispute.partyB.claim,
        evidenceHash: dispute.partyB.evidence?.hash ?? dispute.partyB.evidenceHash ?? '',
      },
      rubric: {
        clarity: 25,
        evidence: 35,
        precedent: 20,
        proportionality: 20,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Configured GenLayer verdict source returned an error.');
  }

  const payload = await response.json() as RemoteVerdictPayload;
  return {
    verdict: normalizeRemoteVerdict(dispute, payload),
    source: 'remote',
  };
}
