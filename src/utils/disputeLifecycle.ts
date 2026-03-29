import { Dispute, Verdict, VerdictWinner } from '../types/dispute';
import { calculateSettlementBreakdown } from './fees';

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }

  return hash;
}

function buildReasoningSummary(
  dispute: Dispute,
  winner: VerdictWinner,
  awardPercentage: number,
  confidence: number,
  appeal: boolean
): string {
  const categoryContext: Record<Dispute['category'], string> = {
    freelance: 'delivery quality, scope alignment, milestone completion, and remediation burden',
    dao: 'bounty completion quality, deliverable completeness, and payout justification',
    nft: 'listing accuracy, provenance evidence, and buyer expectation clarity',
    defi: 'protocol behavior, liquidation fairness, and evidence of abnormal market conditions',
    general: 'claim clarity, supporting evidence strength, and proportional remedy',
  };

  const ruling =
    winner === 'split'
      ? `a split outcome with ${awardPercentage}% allocated to Party A and ${100 - awardPercentage}% allocated to Party B`
      : winner === 'A'
        ? `Party A should receive ${awardPercentage}% of the disputed value`
        : `Party B should receive ${awardPercentage}% of the disputed value`;

  const appealNote = appeal
    ? 'This result reflects an expanded appeal review with additional validators.'
    : 'This result reflects the initial validator consensus run.';

  return `Validators compared both parties' statements, reviewed the submitted evidence references, and scored the case on clarity, evidence, precedent, and proportionality. For this ${dispute.category} dispute, the panel focused on ${categoryContext[dispute.category]}. The consensus outcome was ${ruling}, with ${confidence}% confidence. ${appealNote} Settlement follows the PRD fee model, including filing, resolution, validator, and protocol fee allocation.`;
}

export function generateDemoVerdict(dispute: Dispute, options?: { appeal?: boolean }): Verdict {
  const appeal = options?.appeal ?? false;
  const seed = hashString(
    [
      dispute.id,
      dispute.category,
      dispute.partyA.claim,
      dispute.partyB.claim,
      dispute.partyA.evidenceHash ?? '',
      dispute.partyB.evidenceHash ?? '',
      appeal ? 'appeal' : 'initial',
    ].join('|')
  );

  const hasResponse = dispute.partyB.claim.trim() !== 'No response has been submitted yet.';
  const bucket = seed % 100;
  let winner: VerdictWinner;

  if (!hasResponse) {
    winner = 'A';
  } else if (bucket < 42) {
    winner = 'A';
  } else if (bucket < 78) {
    winner = 'B';
  } else {
    winner = 'split';
  }

  let awardPercentage: number;
  if (winner === 'split') {
    awardPercentage = 45 + (seed % 11);
  } else {
    awardPercentage = 65 + (seed % 26);
  }

  const confidenceBase = winner === 'split' ? 72 : 81;
  const confidence = Math.min(98, confidenceBase + (seed % 14) + (appeal ? 2 : 0));

  const verdict: Verdict = {
    winner,
    confidence,
    reasoning: buildReasoningSummary(dispute, winner, awardPercentage, confidence, appeal),
    awardPercentage,
    validators: appeal ? 7 : 5,
    consensusReached: true,
    timestamp: new Date().toISOString(),
  };

  return {
    ...verdict,
    settlement: calculateSettlementBreakdown({
      ...dispute,
      verdict,
    }),
  };
}

export function calculateAwardBreakdown(dispute: Dispute): { partyAAmount: number; partyBAmount: number } {
  if (!dispute.verdict) {
    return { partyAAmount: 0, partyBAmount: 0 };
  }

  if (dispute.verdict.settlement) {
    return {
      partyAAmount: dispute.verdict.settlement.totalToPartyA,
      partyBAmount: dispute.verdict.settlement.totalToPartyB,
    };
  }

  const { winner, awardPercentage } = dispute.verdict;
  const totalValue = dispute.value;

  if (winner === 'A') {
    return {
      partyAAmount: totalValue * awardPercentage / 100,
      partyBAmount: totalValue * (100 - awardPercentage) / 100,
    };
  }

  if (winner === 'B') {
    return {
      partyAAmount: totalValue * (100 - awardPercentage) / 100,
      partyBAmount: totalValue * awardPercentage / 100,
    };
  }

  return {
    partyAAmount: totalValue * awardPercentage / 100,
    partyBAmount: totalValue * (100 - awardPercentage) / 100,
  };
}
