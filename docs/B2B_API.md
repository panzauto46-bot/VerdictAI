# VerdictAI B2B Integration API

## Overview

VerdictAI provides a decentralized dispute resolution layer that any protocol, marketplace, or dApp can integrate. Replace expensive traditional arbitration with AI-powered, on-chain justice.

---

## Quick Start

### Installation

```bash
npm install @verdictai/sdk genlayer-js
```

### Initialize

```typescript
import { createVerdictAI } from '@verdictai/sdk';

const vai = createVerdictAI({
  contractAddress: '0x82dF22192e2a54805bEa3737EAF29F3A717AfC95',
  chain: 'testnetBradbury',
});
```

---

## API Reference

### Write Methods

#### `submitDispute(walletAddress, params)`

Opens a new dispute on-chain.

```typescript
const tx = await vai.submitDispute('0xClaimantWallet', {
  category: 'freelance',           // freelance | dao | nft | defi | general
  title: 'Payment Dispute',
  description: 'Work completed but payment withheld',
  claimantName: 'Alice',
  claim: 'I delivered all milestones per the agreement',
  evidenceHash: 'QmIPFSHash...',   // IPFS hash of evidence
  respondentAddress: '0xBob...',
  respondentName: 'Bob',
  stakeAmount: 1000000n,           // Escrow stake in wei
});
```

**Returns:** `Promise<string>` — Transaction hash

---

#### `respondToDispute(walletAddress, params)`

Party B submits counter-evidence.

```typescript
const tx = await vai.respondToDispute('0xRespondentWallet', {
  disputeId: 'DSP-1',
  claim: 'The deliverables were incomplete',
  evidenceHash: 'QmCounterEvidence...',
  respondentName: 'Bob',
  stakeAmount: 1000000n,
});
```

---

#### `requestVerdict(walletAddress, disputeId)`

Triggers AI validator consensus. This is the core function — 5 independent LLMs analyze both claims and vote on the outcome.

```typescript
const tx = await vai.requestVerdict('0xAnyWallet', 'DSP-1');
// ⏳ This may take 30-60 seconds as AI validators deliberate
```

---

#### `withdrawFunds(walletAddress, disputeId)`

Winner claims escrowed funds after verdict.

```typescript
const tx = await vai.withdrawFunds('0xWinnerWallet', 'DSP-1');
```

---

#### `appealVerdict(walletAddress, disputeId)`

One-time appeal by the losing party. Triggers re-evaluation.

```typescript
const tx = await vai.appealVerdict('0xLoserWallet', 'DSP-1');
// Then request a new verdict:
await vai.requestVerdict('0xAnyWallet', 'DSP-1');
```

---

### Read Methods

#### `getDisputeStatus(disputeId)`

Returns full dispute data.

```typescript
const dispute = await vai.getDisputeStatus('DSP-1');

console.log(dispute);
// {
//   id: 'DSP-1',
//   category: 'freelance',
//   title: 'Payment Dispute',
//   status: 'verdict',
//   value: '2000000',
//   party_a: { name: 'Alice', claim: '...', stake: '1000000' },
//   party_b: { name: 'Bob', claim: '...', stake: '1000000' },
//   verdict: {
//     winner: 'A',
//     confidence: 85,
//     reasoning: 'AI analysis...',
//     award_percentage: 80,
//     validators: 5,
//     consensus_reached: true
//   }
// }
```

---

#### `getVerdict(disputeId)`

Returns just the verdict object.

```typescript
const verdict = await vai.getVerdict('DSP-1');

if (verdict) {
  console.log(`Winner: Party ${verdict.winner}`);
  console.log(`Confidence: ${verdict.confidence}%`);
  console.log(`Award: ${verdict.award_percentage}%`);
}
```

---

#### `getDisputeCount()`

Returns total number of disputes filed.

```typescript
const count = await vai.getDisputeCount();
console.log(`${count} disputes filed on VerdictAI`);
```

---

## Integration Patterns

### 🛒 Marketplace Integration

Add dispute resolution to your marketplace/escrow:

```typescript
// After a buyer flags an order
const tx = await vai.submitDispute(buyerWallet, {
  category: 'freelance',
  title: `Order #${orderId} Dispute`,
  description: disputeReason,
  claimantName: buyerName,
  claim: buyerClaim,
  evidenceHash: await uploadToIPFS(evidence),
  respondentAddress: sellerWallet,
  respondentName: sellerName,
  stakeAmount: orderValue,
});

// Monitor for resolution
const status = await vai.getDisputeStatus(disputeId);
if (status.status === 'verdict') {
  const winner = status.verdict!.winner;
  // Route funds accordingly
}
```

### 🏛️ DAO Governance

Resolve proposal disputes:

```typescript
const tx = await vai.submitDispute(proposerWallet, {
  category: 'dao',
  title: `Proposal #${proposalId} Challenge`,
  description: 'Proposal violates DAO constitution Article 5',
  claimantName: 'Challenger',
  claim: challengeReason,
  evidenceHash: constitutionHash,
  respondentAddress: proposerAddress,
  respondentName: 'Proposer',
  stakeAmount: challengeStake,
});
```

### 💰 DeFi Protocol

Automate dispute resolution for DeFi insurance claims:

```typescript
const tx = await vai.submitDispute(claimantWallet, {
  category: 'defi',
  title: `Insurance Claim #${claimId}`,
  description: 'Smart contract exploit resulted in loss of funds',
  claimantName: 'Policyholder',
  claim: 'Protocol bug caused $50k loss, covered under policy',
  evidenceHash: txProofHash,
  respondentAddress: insurerAddress,
  respondentName: 'Insurance DAO',
  stakeAmount: claimAmount,
});
```

---

## Webhook Events (Coming Soon)

Subscribe to dispute lifecycle events:

```typescript
vai.on('dispute:submitted', (disputeId) => { /* ... */ });
vai.on('dispute:responded', (disputeId) => { /* ... */ });
vai.on('dispute:verdict', (disputeId, verdict) => { /* ... */ });
vai.on('dispute:appealed', (disputeId) => { /* ... */ });
vai.on('dispute:enforced', (disputeId) => { /* ... */ });
```

---

## Contract Details

| Property | Value |
|----------|-------|
| **Network** | GenLayer Bradbury Testnet |
| **Contract Address** | `0x82dF22192e2a54805bEa3737EAF29F3A717AfC95` |
| **Language** | Python (GenLayer SDK) |
| **AI Validators** | 5 (GPT-4, Claude, Gemini, LLaMA, DeepSeek) |
| **Consensus** | Equivalence Principle (`strict_eq`) |
| **Appeal** | 1 per dispute |

---

## Support

- **GitHub:** [github.com/panzauto46-bot/VerdictAI](https://github.com/panzauto46-bot/VerdictAI)
- **GenLayer Docs:** [docs.genlayer.com](https://docs.genlayer.com)
