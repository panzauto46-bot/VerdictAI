# VerdictAI

## Decentralized AI Dispute Resolution on GenLayer

*Product Requirements Document (PRD)*

| Item | Value |
| --- | --- |
| Hackathon | GenLayer Bradbury |
| Track | AI Agent / Automation |
| Deadline | April 4, 2026 |

## 1. Executive Summary

VerdictAI is a decentralized dispute resolution protocol built on GenLayer, enabling trustless, AI-powered arbitration for Web3 ecosystems. It leverages GenLayer's Intelligent Contract framework - powered by Optimistic Democracy consensus and the Equivalence Principle - to deliver fair, transparent, and permanent dispute outcomes without centralized intermediaries.

Unlike traditional arbitration (slow, expensive, biased) or basic on-chain voting (easily manipulated), VerdictAI routes disputes through a panel of AI validator nodes that independently analyze evidence, apply consistent reasoning logic, and reach consensus using GenLayer's native mechanisms. The result is immutable, auditable, and resistant to collusion.

| The Problem | The Solution |
| --- | --- |
| Web3 lacks reliable dispute resolution. Freelancers, DAOs, NFT marketplaces, and DeFi protocols all suffer from: slow arbitration, high costs, centralized bias, and no on-chain enforcement. | VerdictAI deploys Intelligent Contracts on GenLayer where AI validators read submitted evidence, reason about the merits, and reach consensus - all on-chain and enforceable. |

## 2. Project Overview

### 2.1 Project Name & Tagline

| Item | Value |
| --- | --- |
| Name | VerdictAI |
| Tagline | "Trustless disputes. AI consensus. On-chain justice." |
| Category | AI Agent / Automation - Decentralized Dispute Resolution Protocol |

### 2.2 Core Value Proposition

| Attribute | Benefit |
| --- | --- |
| Speed | Disputes resolved in hours, not weeks |
| Cost | Fraction of traditional arbitration fees |
| Fairness | No single point of bias - multi-LLM AI consensus |
| Enforcement | Outcome automatically enforced via smart contract |
| Permanence | Every verdict is immutable and auditable on-chain |
| Revenue | Creator earns up to 20% of all fees per case forever (GenLayer dev fee model) |

### 2.3 Target Users

- Freelancers & clients disputing milestone payments
- DAO contributors claiming unpaid bounties
- NFT buyers/sellers disputing authenticity or delivery
- DeFi protocol users facing counterparty default
- Any Web3 protocol needing embedded dispute resolution (B2B)

## 3. Technical Architecture

### 3.1 GenLayer Compliance

VerdictAI is fully architected around GenLayer's two core requirements:

#### 3.1.1 Optimistic Democracy Consensus

Each dispute is processed by multiple GenLayer validator nodes, each running their own LLM. The contract uses Optimistic Democracy, meaning:

- A leader validator proposes an initial verdict based on evidence analysis
- All other validators independently evaluate and either agree or challenge
- If consensus is reached above threshold, the verdict is finalized on-chain
- Challengers must stake tokens - discouraging bad-faith challenges
- The system is efficient (optimistic) but adversarially robust (democratic)

#### 3.1.2 Equivalence Principle

The Intelligent Contract implements the Equivalence Principle to ensure consistent AI reasoning:

- The contract defines a deterministic evaluation rubric (scoring criteria)
- Multiple LLMs running on different validators must produce equivalent outcomes
- If two validators reach the same verdict via different reasoning paths, they are considered equivalent
- This prevents model-specific bias - no single LLM can dominate the outcome

### 3.2 System Architecture Diagram

```text
[ User submits dispute + evidence ]
          |
          v
[ VerdictAI Intelligent Contract (GenLayer) ]
    |           |           |
    v           v           v
[ LLM-A ]   [ LLM-B ]   [ LLM-C ]   (Validators)
    |           |           |
    v           v           v
[ Optimistic Democracy Aggregation ]
          |
          v
[ Final Verdict - On-Chain Enforcement ]
```

### 3.3 Intelligent Contract Specification

#### 3.3.1 Core Contract Functions

| Function | Description |
| --- | --- |
| `submitDispute()` | Party A opens a dispute, deposits stake, submits evidence hash |
| `respondToDispute()` | Party B submits counter-evidence within time window |
| `requestAIVerdict()` | Triggers GenLayer AI validator consensus process |
| `finalizeVerdict()` | Records verdict on-chain, triggers fund release or penalty |
| `appealVerdict()` | Loser may appeal once by increasing stake (escalates validator count) |
| `getDisputeStatus()` | Public view - returns current phase and ruling |
| `withdrawFunds()` | Winner claims escrowed funds after verdict |

#### 3.3.2 AI Evaluation Rubric (Equivalence Principle Implementation)

Each validator LLM receives the following structured prompt template:

```text
You are an impartial arbitrator. Analyze the following dispute:
DISPUTE_TYPE: {type}
PARTY_A_CLAIM: {claim_a}
PARTY_B_CLAIM: {claim_b}
EVIDENCE: {ipfs_hash_evidence}
RUBRIC: [Clarity 25%] [Evidence 35%] [Precedent 20%] [Proportionality 20%]
Return JSON: {"winner": "A|B|split", "confidence": 0-100, "reasoning": "...", "award_pct": 0-100}
```

## 4. Features & User Stories

### 4.1 MVP Feature Set (Hackathon Scope)

| ID | Feature | Description | Priority |
| --- | --- | --- | --- |
| F-01 | Dispute Submission | Both parties submit claims and upload evidence (IPFS link) | Must Have |
| F-02 | Escrow Management | Funds locked in contract until verdict is reached | Must Have |
| F-03 | AI Arbitration Engine | GenLayer Intelligent Contract triggers multi-LLM consensus | Must Have |
| F-04 | Verdict Display | On-chain verdict with reasoning summary shown to users | Must Have |
| F-05 | Auto Enforcement | Winning party auto-receives escrowed funds post-verdict | Must Have |
| F-06 | Appeal Mechanism | One-time appeal option with increased stake requirement | Should Have |
| F-07 | Dispute Dashboard | Web UI showing active, pending, and resolved disputes | Should Have |
| F-08 | Category Templates | Pre-built templates for Freelance, DAO, NFT, DeFi disputes | Nice to Have |

### 4.2 User Stories

#### As Party A (Claimant)

1. I want to open a dispute by submitting my claim and evidence so that the AI can evaluate my case fairly.
2. I want to lock funds in escrow so the other party cannot run away with payment.
3. I want to see a transparent reasoning summary so I understand why the verdict was reached.

#### As Party B (Respondent)

4. I want to be notified when a dispute is filed against me so I can respond within the deadline.
5. I want to submit counter-evidence and my version of events so I get a fair hearing.
6. I want to appeal the verdict once if I believe the AI made a significant error.

#### As a Protocol Integrator (B2B)

7. I want to integrate VerdictAI into my marketplace contract so disputes are resolved without leaving my platform.
8. I want customizable dispute templates so VerdictAI fits my use case out of the box.

## 5. Product Flow

### 5.1 Dispute Lifecycle

| Step | Phase | Description |
| --- | --- | --- |
| 1 | Open | Party A submits dispute, deposits stake, uploads evidence |
| 2 | Respond | Party B receives notification, submits counter-evidence (48h window) |
| 3 | AI Review | Intelligent Contract sends case to GenLayer validators |
| 4 | Consensus | Multiple LLMs evaluate independently, Optimistic Democracy aggregates |
| 5 | Verdict | Ruling finalized on-chain, reasoning summary published |
| 6 | Enforce | Winner auto-receives funds; loser's stake partially burned/redistributed |
| 7 | Appeal (opt.) | Loser may appeal once, triggering expanded validator panel |

### 5.2 Dispute Categories & Templates

| Category | Common Cases |
| --- | --- |
| Freelance | Milestone not delivered, quality below spec, scope creep |
| DAO Bounty | Work submitted but not rewarded, disagreement on completion |
| NFT Sale | Item not delivered post-payment, counterfeit claim |
| DeFi | Loan default, liquidation dispute, oracle manipulation claim |
| General | Custom dispute with manual evidence submission |

## 6. Business Model & GenLayer Revenue

### 6.1 Fee Structure

| Fee Type | Amount | Notes |
| --- | --- | --- |
| Filing Fee | 0.5% of dispute value | Paid by claimant on dispute open |
| Resolution Fee | 1.0% of dispute value | Split from both parties on verdict |
| Appeal Premium | 2x base fee | Charged to appellant |
| Protocol Dev Fee | Up to 20% of all fees | Permanent via GenLayer Dev Fee Model |
| Validator Reward | Remaining fee pool | Distributed to GenLayer validators |

The Dev Fee model means VerdictAI generates recurring revenue for its creator (you) on every case resolved - forever. As VerdictAI scales, so does the passive income stream.

### 6.2 Revenue Projections (Conservative)

| Period | Volume | Avg Dispute Value | Est. Protocol Revenue |
| --- | --- | --- | --- |
| Month 1 (Post-launch) | 50 disputes | $10,000 avg value | $375 protocol fees |
| Month 6 | 500 disputes | $15,000 avg value | $5,625 protocol fees |
| Month 12 | 2,000 disputes | $20,000 avg value | $30,000 protocol fees |
| Year 2 (B2B integrated) | 10,000+ disputes | Varies | $150,000+ protocol fees |

## 7. Competitive Analysis

| Solution | Speed | Cost | Enforcement | Decision Maker |
| --- | --- | --- | --- | --- |
| Traditional Arbitration | Weeks to months | $1,000 - $50,000+ | Off-chain, not enforceable | Centralized |
| Kleros | Days | ~$50 - $500 | Token-based voting | Human jurors (gameable) |
| Aragon Court | Days | ~$100 - $1,000 | Token-based | Human jurors |
| VerdictAI | Hours | 0.5-1.5% of value | Auto on-chain enforcement | AI consensus (GenLayer) |

VerdictAI's key differentiator: it is the only dispute resolution protocol where the decision maker is a decentralized AI consensus - not gameable by token whales, not biased by human emotion, not slow like traditional arbitration.

## 8. Development Plan (6-Day Sprint)

| Day | Focus | Deliverables |
| --- | --- | --- |
| Day 1 | Architecture & Setup | GenLayer Studio setup, contract skeleton, data models, evidence schema |
| Day 2 | Core Contract | `submitDispute()`, `respondToDispute()`, escrow logic, IPFS integration |
| Day 3 | AI Arbitration Engine | GenLayer Intelligent Contract with Optimistic Democracy + Equivalence Principle prompt |
| Day 4 | Verdict & Enforcement | `finalizeVerdict()`, appeal logic, auto fund release mechanism |
| Day 5 | Frontend UI | React/Next.js dashboard - submit, respond, view verdict |
| Day 6 | Testing & Demo | End-to-end test on Bradbury testnet, record demo video, write submission |

## 9. Judging Criteria Alignment

| Criterion | VerdictAI Approach | Confidence |
| --- | --- | --- |
| Technical Execution | Full Intelligent Contract deployed on Bradbury testnet with working consensus | High |
| Innovation | First AI-powered dispute resolution on GenLayer; novel application of Equivalence Principle | High |
| Real-World Impact | Solves a massive pain point across all Web3 verticals | High |
| GenLayer Usage | Deep integration: Optimistic Democracy + Equivalence Principle are core, not peripheral | Critical |
| Business Viability | Clear revenue model leveraging GenLayer dev fee; B2B integration story | High |
| Demo Quality | Live dispute resolution demo with real AI verdict and on-chain enforcement | High |

## 10. Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| GenLayer testnet instability | Use GenLayer Studio for local testing; deploy to testnet only for final demo |
| AI consensus non-determinism | Implement strict JSON output schema; use confidence threshold gating |
| Evidence retrieval latency (IPFS) | Use IPFS gateway with fallback; cache evidence hash on-chain |
| 6-day time constraint | Prioritize Intelligent Contract first; frontend is secondary deliverable |
| Complex appeal logic | Implement appeal as stretch goal; core MVP ships without it |

## 11. Success Metrics

### Hackathon Demo Goals

- Submit at least 1 live dispute on Bradbury testnet and receive an AI verdict
- Demonstrate Optimistic Democracy consensus with 3+ validators reaching agreement
- Show on-chain fund release to winner after verdict
- Deploy working frontend connected to live Intelligent Contract

### Post-Hackathon KPIs

- 100 disputes processed in first month post-mainnet launch
- 3 Web3 protocol integrations (B2B) within 6 months
- $50,000 total dispute value processed in first quarter

## Appendix: Tech Stack

| Layer | Technology |
| --- | --- |
| Smart Contract | GenLayer Intelligent Contract (Python-based GenLayer DSL) |
| AI Consensus | GenLayer Optimistic Democracy + Equivalence Principle |
| Evidence Storage | IPFS (via Web3.Storage or Pinata) |
| Frontend | Next.js + TailwindCSS + ethers.js |
| Wallet Integration | MetaMask / WalletConnect |
| Testing | GenLayer Studio (local) + Bradbury Testnet |
| Deployment | GenLayer Bradbury Testnet |

---

*End of PRD*

VerdictAI | GenLayer Testnet Bradbury Hackathon 2026
