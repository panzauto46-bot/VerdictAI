# VerdictAI Integration Setup

This document covers the pieces that are already prepared in the codebase and the values that still need to be provided before VerdictAI can run against live services.

## Current Status

The app is already prepared for three execution layers:

- `demo`: local fallback mode
- `wallet`: wallet-signed receipts through an injected provider
- `genlayer`: live writes through `genlayer-js`
- `contract`: legacy ethers-style fallback once ABI/address are configured

The frontend is also prepared for two evidence modes:

- `demo-local`: browser-local file URLs for temporary demos
- `ipfs`: live uploads through `Pinata`

Verdict resolution is prepared for two source modes:

- local demo verdict engine
- remote verdict source provided through an HTTP endpoint

## Files You Will Touch

- [`.env.example`](E:/VerdictAI/.env.example)
- [`src/services/verdictaiAdapter.ts`](E:/VerdictAI/src/services/verdictaiAdapter.ts)
- [`src/services/verdictSource.ts`](E:/VerdictAI/src/services/verdictSource.ts)
- [`src/services/ipfs.ts`](E:/VerdictAI/src/services/ipfs.ts)

## Step 1: Create Your Local Env File

Create a local env file from the example:

```powershell
Copy-Item .env.example .env.local
```

Then fill in the values you have.

## Step 2: Configure IPFS / Pinata

Required env:

```env
VITE_PINATA_JWT=your_pinata_jwt_here
VITE_IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs
```

What this unlocks:

- claimant evidence uploads go to live IPFS
- respondent evidence uploads go to live IPFS
- dispute detail links open actual gateway URLs

If `VITE_PINATA_JWT` is missing, uploads still work in demo mode with local object URLs.

## Step 3: Configure the Verdict Source

Optional env:

```env
VITE_GENLAYER_VERDICT_API_URL=https://your-service.example.com/verdict
VITE_GENLAYER_VERDICT_API_KEY=
```

The frontend will send a `POST` request with this shape:

```json
{
  "disputeId": "DSP-001",
  "category": "freelance",
  "title": "Website Development - Milestone Payment",
  "description": "Dispute summary",
  "appeal": false,
  "partyA": {
    "name": "Claimant",
    "address": "0x...",
    "claim": "Claim text",
    "evidenceHash": "Qm..."
  },
  "partyB": {
    "name": "Respondent",
    "address": "0x...",
    "claim": "Counter claim",
    "evidenceHash": "Qm..."
  },
  "rubric": {
    "clarity": 25,
    "evidence": 35,
    "precedent": 20,
    "proportionality": 20
  }
}
```

Expected response:

```json
{
  "winner": "A",
  "confidence": 91,
  "reasoning": "Validator consensus summary",
  "awardPercentage": 82,
  "validators": 5,
  "consensusReached": true,
  "timestamp": "2026-03-29T10:00:00.000Z"
}
```

If this endpoint is not configured, the app falls back to the built-in demo verdict engine.

## Step 4: Configure Contract Writes

Preferred GenLayer env:

```env
VITE_GENLAYER_CHAIN=testnetBradbury
VITE_GENLAYER_ENDPOINT=
VITE_GENLAYER_CONTRACT_ADDRESS=0xYourContractAddress
```

The GenLayerJS adapter will try to call these methods by name:

- `submitDispute`
- `respondToDispute`
- `requestAIVerdict`
- `withdrawFunds`
- `appealVerdict`

The repo is also prepared to query the deployed contract schema through `getContractSchema`, which is often more useful on GenLayer than relying only on a traditional ABI.

Optional legacy fallback env:

```env
VITE_VERDICTAI_CONTRACT_ADDRESS=0xYourContractAddress
VITE_VERDICTAI_CONTRACT_ABI_JSON=[...]
VITE_VERDICTAI_ENABLE_CONTRACT_WRITES=true
```

Current adapter behavior:

- if a GenLayer contract address exists, it attempts live writes through `genlayer-js`
- if the GenLayerJS write path is unavailable but ABI + address + enable flag exist, it tries the fallback ethers-style adapter
- if live writes are unavailable, it falls back to wallet-signed receipts
- if no wallet is connected, it falls back to demo action receipts

## Step 5: Configure Explorer Links

Optional env:

```env
VITE_TX_EXPLORER_URL=https://your-explorer.example.com/tx
```

This allows action receipts to link to a public transaction viewer.

## Step 6: Bradbury Test Run

Once the required inputs are available, the target verification flow is:

1. Connect wallet.
2. Submit a dispute with live IPFS evidence.
3. Open the new dispute from dashboard.
4. Submit the respondent response.
5. Trigger verdict resolution from the configured source.
6. Verify receipts and explorer links.
7. Claim funds.
8. Run one appeal flow as an optional stretch pass.

## What Still Needs To Be Supplied

To complete live integration, the remaining external inputs are:

- deployed contract address
- optional RPC endpoint if you want to override the SDK default for the selected GenLayer chain
- contract ABI if you still want the fallback ethers-style path
- Pinata JWT or chosen IPFS provider credentials
- Bradbury/testnet explorer URL
- optional verdict service endpoint if GenLayer results are exposed through an API layer

## Notes

- The codebase is already safe to demo without these values because all flows degrade to honest fallback modes.
- Once you provide the missing inputs, the next step is to wire `.env.local`, verify the ABI method names, and run an end-to-end Bradbury pass.
