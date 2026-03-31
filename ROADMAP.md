# VerdictAI Roadmap

## Overview

This document tracks the development roadmap for **VerdictAI** — a decentralized AI dispute resolution protocol built on GenLayer for the **Bradbury Hackathon** (deadline: April 4, 2026).

---

## ✅ Progress Summary

**Last updated:** `March 31, 2026`

### Completed Milestones

| # | Milestone | Status | Date |
|---|-----------|--------|------|
| 1 | Frontend foundation & data model | ✅ Done | Mar 29 |
| 2 | Live dispute submission flow | ✅ Done | Mar 29 |
| 3 | Party B respondent flow | ✅ Done | Mar 29 |
| 4 | Wallet connect (MetaMask + Demo) | ✅ Done | Mar 29 |
| 5 | Contract adapter (3-mode) | ✅ Done | Mar 29 |
| 6 | Evidence upload (IPFS/Pinata) | ✅ Done | Mar 29 |
| 7 | AI verdict engine (simulated) | ✅ Done | Mar 29 |
| 8 | Fee & settlement engine | ✅ Done | Mar 29 |
| 9 | GenLayer JS SDK integration | ✅ Done | Mar 29 |
| 10 | **Intelligent Contract written** | ✅ Done | Mar 29 |
| 11 | **Contract deployed to GenLayer** | ✅ Done | Mar 29 |
| 12 | **AI Arbitration tested (full consensus)** | ✅ Done | Mar 29 |
| 13 | **Full lifecycle verified on-chain** | ✅ Done | Mar 29 |
| 14 | **Frontend adapter wired to contract** | ✅ Done | Mar 29 |
| 15 | **Professional README** | ✅ Done | Mar 29 |
| 16 | **Hero centered + visual cleanup** | ✅ Done | Mar 31 |
| 17 | **Wallet error guidance improved** | ✅ Done | Mar 31 |

### Smart Contract Verification

All 7 contract methods tested and verified on GenLayer Studio:

```
✅ Deploy             → FINALIZED (SUCCESS)
✅ submit_dispute      → FINALIZED (SUCCESS)
✅ respond_to_dispute  → FINALIZED (SUCCESS)
✅ request_ai_verdict  → FINALIZED (SUCCESS) — 5 AI validators consensus
✅ appeal_verdict      → FINALIZED (SUCCESS)
✅ request_ai_verdict  → FINALIZED (SUCCESS) — Appeal re-evaluation
✅ withdraw_funds      → FINALIZED (SUCCESS)
```

**Contract Address:** `0x82dF22192e2a54805bEa3737EAF29F3A717AfC95`

---

## Current State

### ✅ What's working

- Landing page with VerdictAI branding
- Shared live dispute state with local browser persistence
- Dispute dashboard with statistics
- Full dispute detail page with timeline
- Dispute submission form
- Party B response flow
- AI verdict with multi-LLM consensus (GPT-4, Claude, Gemini, LLaMA, DeepSeek)
- One-time appeal mechanism
- Fund withdrawal/enforcement
- Wallet connect (MetaMask + Demo mode)
- IPFS evidence upload (Pinata)
- Action receipts for all lifecycle events
- Fee breakdown (filing, resolution, appeal, dev)
- GenLayer Intelligent Contract deployed and tested
- Frontend adapter wired to deployed contract

### 🔄 In Progress

- Final UI micro-polish for judging (mobile spacing + button hierarchy)
- Explorer link integration for transaction hashes

### 🔮 Future (Post-Hackathon)

- Mainnet deployment
- B2B/protocol integrator API
- Analytics dashboard
- Public documentation portal
- Multi-language support
- Mobile app

---

## Phase Details

### Phase 1 - Foundation ✅
**Date:** March 29, 2026

- [x] Create dispute data model
- [x] Define main app state for submit → dashboard → detail
- [x] Clean up copywriting and broken text rendering
- [x] Wire placeholder buttons to functional handlers

### Phase 2 - Live Frontend Flow ✅
**Date:** March 29, 2026

- [x] Dispute submission creates real data in app state
- [x] New disputes appear in dashboard
- [x] Dispute detail pages open real records
- [x] Consistent dispute lifecycle status
- [x] Dynamic dispute ID generation

### Phase 3 - Respondent Flow ✅
**Date:** March 29, 2026

- [x] Party B response panel in dispute detail
- [x] Counter-claim and counter-evidence fields
- [x] Responding status with 48-hour deadline display
- [x] Dashboard reflects response status

### Phase 4 - Wallet and Contract Adapter ✅
**Date:** March 29, 2026

- [x] MetaMask wallet connect
- [x] Demo fallback mode
- [x] 3-mode contract adapter (demo, wallet-signed, contract)
- [x] GenLayerJS client integration
- [x] Payload shapes match contract methods

### Phase 5 - Evidence and Verdict Engine ✅
**Date:** March 29, 2026

- [x] IPFS upload with Pinata
- [x] Evidence hash stored in dispute
- [x] Verdict schema (winner, confidence, reasoning, award_pct)
- [x] AI consensus through GenLayer validators
- [x] Reasoning displayed in dispute detail

### Phase 6 - Enforcement and Appeal ✅
**Date:** March 29, 2026

- [x] Withdraw funds mechanism
- [x] One-time appeal mechanism
- [x] Appeal triggers AI re-evaluation
- [x] Enforced status in UI
- [x] Fee structure: filing 0.5%, resolution 1.0%, appeal 2x

### Phase 7 - Smart Contract & Demo Readiness ✅
**Date:** March 29, 2026

- [x] Intelligent Contract written in Python
- [x] Deployed to GenLayer Studio/Bradbury
- [x] Full end-to-end lifecycle tested on-chain
- [x] Frontend adapter updated with correct method names
- [x] Professional README with architecture diagrams
- [x] Contract address configured in .env.local

---

## Definition of Done ✅

All criteria met:

1. ✅ A user can create a new dispute from the UI
2. ✅ The dispute appears in the dashboard
3. ✅ Dispute detail shows claim, evidence, timeline, and status
4. ✅ There is a response flow for the opposing party
5. ✅ There is an AI verdict with structured reasoning (on-chain)
6. ✅ There is enforcement with claim-funds demonstration
7. ✅ The full flow is stable enough for a live demo
8. ✅ Smart contract deployed and verified on GenLayer

---

## Final Checklist for Submission

- [x] Smart contract deployed and tested
- [x] Frontend functional with demo mode
- [x] README with architecture, structure, and diagrams
- [x] ROADMAP updated with progress
- [ ] Demo video recorded
- [ ] Repository cleaned up
- [ ] Hackathon submission form filled

---

## Notes

- For the hackathon, the focus is **demo credibility** — showing a real, working AI-powered dispute resolution flow.
- The AI arbitration engine uses GenLayer's Equivalence Principle with `strict_eq` for deterministic consensus.
- The contract is designed to be upgradeable through GenLayer Studio's "Upgrade code" feature.
- All verdict data is stored on-chain as JSON strings for maximum transparency.
