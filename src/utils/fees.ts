import { Dispute, FeeBreakdown, SettlementBreakdown, VerdictWinner } from '../types/dispute';

const FILING_FEE_RATE = 0.005;
const RESOLUTION_FEE_RATE = 0.01;
const PROTOCOL_DEV_FEE_SHARE = 0.2;
const APPEAL_PREMIUM_MULTIPLIER = 2;
const LOSER_STAKE_BURN_RATE = 0.15;
const LOSER_STAKE_REDISTRIBUTION_RATE = 0.1;

function roundCurrency(value: number): number {
  return Number(value.toFixed(4));
}

export function calculateFeeBreakdown(disputeValue: number, claimantStake: number, respondentStake: number): FeeBreakdown {
  const filingFee = disputeValue * FILING_FEE_RATE;
  const resolutionFee = disputeValue * RESOLUTION_FEE_RATE;
  const protocolDevFee = (filingFee + resolutionFee) * PROTOCOL_DEV_FEE_SHARE;
  const validatorReward = (filingFee + resolutionFee) - protocolDevFee;
  const appealPremium = filingFee * APPEAL_PREMIUM_MULTIPLIER;

  return {
    filingFee: roundCurrency(filingFee),
    resolutionFee: roundCurrency(resolutionFee),
    appealPremium: roundCurrency(appealPremium),
    protocolDevFee: roundCurrency(protocolDevFee),
    validatorReward: roundCurrency(validatorReward),
    claimantDeposit: roundCurrency(claimantStake + filingFee + resolutionFee / 2),
    respondentDeposit: roundCurrency(respondentStake + resolutionFee / 2),
  };
}

function buildPrincipalDistribution(winner: VerdictWinner, disputeValue: number, awardPercentage: number): {
  principalToPartyA: number;
  principalToPartyB: number;
} {
  if (winner === 'A') {
    return {
      principalToPartyA: disputeValue * awardPercentage / 100,
      principalToPartyB: disputeValue * (100 - awardPercentage) / 100,
    };
  }

  if (winner === 'B') {
    return {
      principalToPartyA: disputeValue * (100 - awardPercentage) / 100,
      principalToPartyB: disputeValue * awardPercentage / 100,
    };
  }

  return {
    principalToPartyA: disputeValue * awardPercentage / 100,
    principalToPartyB: disputeValue * (100 - awardPercentage) / 100,
  };
}

export function calculateSettlementBreakdown(dispute: Dispute): SettlementBreakdown {
  const fees = dispute.fees ?? calculateFeeBreakdown(dispute.value, dispute.partyA.stake, dispute.partyB.stake);
  const verdict = dispute.verdict;
  const disputeValue = dispute.value;
  const grossEscrow = disputeValue + dispute.partyA.stake + dispute.partyB.stake;

  if (!verdict) {
    return {
      grossEscrow: roundCurrency(grossEscrow),
      principalToPartyA: 0,
      principalToPartyB: 0,
      claimantStakeReturn: 0,
      respondentStakeReturn: 0,
      redistributedStakeToWinner: 0,
      burnedStake: 0,
      filingFee: fees.filingFee,
      resolutionFee: fees.resolutionFee,
      appealPremiumApplied: 0,
      protocolDevFee: fees.protocolDevFee,
      validatorReward: fees.validatorReward,
      totalToPartyA: 0,
      totalToPartyB: 0,
    };
  }

  const appealPremiumApplied = dispute.appealUsed ? fees.appealPremium : 0;
  const totalFeePool = fees.filingFee + fees.resolutionFee + appealPremiumApplied;
  const protocolDevFee = totalFeePool * PROTOCOL_DEV_FEE_SHARE;
  const validatorReward = totalFeePool - protocolDevFee;

  const { principalToPartyA, principalToPartyB } = buildPrincipalDistribution(
    verdict.winner,
    disputeValue,
    verdict.awardPercentage
  );

  let claimantStakeReturn = dispute.partyA.stake;
  let respondentStakeReturn = dispute.partyB.stake;
  let redistributedStakeToWinner = 0;
  let burnedStake = 0;

  if (verdict.winner === 'A') {
    burnedStake = dispute.partyB.stake * LOSER_STAKE_BURN_RATE;
    redistributedStakeToWinner = dispute.partyB.stake * LOSER_STAKE_REDISTRIBUTION_RATE;
    respondentStakeReturn = dispute.partyB.stake - burnedStake - redistributedStakeToWinner;
  } else if (verdict.winner === 'B') {
    burnedStake = dispute.partyA.stake * LOSER_STAKE_BURN_RATE;
    redistributedStakeToWinner = dispute.partyA.stake * LOSER_STAKE_REDISTRIBUTION_RATE;
    claimantStakeReturn = dispute.partyA.stake - burnedStake - redistributedStakeToWinner;
  }

  const claimantFeeLoad =
    fees.filingFee +
    fees.resolutionFee / 2 +
    (dispute.appealRequestedBy === 'A' ? appealPremiumApplied : 0);
  const respondentFeeLoad =
    fees.resolutionFee / 2 +
    (dispute.appealRequestedBy === 'B' ? appealPremiumApplied : 0);

  let totalToPartyA = principalToPartyA + claimantStakeReturn - claimantFeeLoad;
  let totalToPartyB = principalToPartyB + respondentStakeReturn - respondentFeeLoad;

  if (verdict.winner === 'A') {
    totalToPartyA += redistributedStakeToWinner;
  } else if (verdict.winner === 'B') {
    totalToPartyB += redistributedStakeToWinner;
  }

  return {
    grossEscrow: roundCurrency(grossEscrow),
    principalToPartyA: roundCurrency(principalToPartyA),
    principalToPartyB: roundCurrency(principalToPartyB),
    claimantStakeReturn: roundCurrency(claimantStakeReturn),
    respondentStakeReturn: roundCurrency(respondentStakeReturn),
    redistributedStakeToWinner: roundCurrency(redistributedStakeToWinner),
    burnedStake: roundCurrency(burnedStake),
    filingFee: fees.filingFee,
    resolutionFee: fees.resolutionFee,
    appealPremiumApplied: roundCurrency(appealPremiumApplied),
    protocolDevFee: roundCurrency(protocolDevFee),
    validatorReward: roundCurrency(validatorReward),
    totalToPartyA: roundCurrency(totalToPartyA),
    totalToPartyB: roundCurrency(totalToPartyB),
  };
}

export function formatEth(value: number): string {
  return `${value.toFixed(value >= 100 ? 2 : 4)} ETH`;
}

