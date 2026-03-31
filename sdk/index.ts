/**
 * VerdictAI SDK
 * 
 * Official TypeScript SDK for integrating VerdictAI dispute resolution
 * into any dApp or protocol on GenLayer.
 * 
 * @example
 * ```typescript
 * import { VerdictAI } from '@verdictai/sdk';
 * 
 * const vai = new VerdictAI({
 *   contractAddress: '0x2b468A6b65e028c149cbFA0106815039dBED481f',
 *   chain: 'testnetBradbury',
 * });
 * 
 * // Submit a dispute
 * const txHash = await vai.submitDispute({
 *   category: 'freelance',
 *   title: 'Payment Dispute',
 *   description: 'Developer completed work but payment was not released',
 *   claimantName: 'Alice',
 *   claim: 'I delivered all milestones as agreed',
 *   evidenceHash: 'QmEvidence123',
 *   respondentAddress: '0x...',
 *   respondentName: 'Bob',
 *   stakeAmount: 1000000n,
 * });
 * ```
 */

import { createClient } from 'genlayer-js';
import { testnetBradbury, localnet } from 'genlayer-js/chains';
import { TransactionStatus, type CalldataEncodable } from 'genlayer-js/types';
import type { Address } from 'viem';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface VerdictAIConfig {
  /** Deployed contract address */
  contractAddress: string;
  /** Chain to connect to: 'testnetBradbury' | 'localnet' */
  chain?: 'testnetBradbury' | 'localnet';
  /** Custom RPC endpoint */
  endpoint?: string;
  /** Wallet provider (window.ethereum) */
  provider?: any;
}

export interface SubmitDisputeParams {
  category: 'freelance' | 'dao' | 'nft' | 'defi' | 'general';
  title: string;
  description: string;
  claimantName: string;
  claim: string;
  evidenceHash: string;
  respondentAddress: string;
  respondentName: string;
  stakeAmount: bigint;
}

export interface RespondToDisputeParams {
  disputeId: string;
  claim: string;
  evidenceHash: string;
  respondentName: string;
  stakeAmount: bigint;
}

export interface DisputeParty {
  address: string;
  name: string;
  claim: string;
  evidence_hash: string;
  stake: string;
}

export interface Verdict {
  winner: 'A' | 'B' | 'split';
  confidence: number;
  reasoning: string;
  award_percentage: number;
  validators: number;
  consensus_reached: boolean;
}

export interface DisputeStatus {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'responding' | 'reviewing' | 'verdict' | 'appealed' | 'enforced';
  value: string;
  appeal_used: boolean;
  enforced: boolean;
  party_a: DisputeParty;
  party_b: DisputeParty;
  verdict?: Verdict;
}

export type DisputeLifecycleEvent =
  | 'dispute:submitted'
  | 'dispute:responded'
  | 'dispute:verdict'
  | 'dispute:appealed'
  | 'dispute:enforced';

// ─── SDK Class ──────────────────────────────────────────────────────────────

export class VerdictAI {
  private client: ReturnType<typeof createClient>;
  private contractAddress: Address;
  private chain: 'testnetBradbury' | 'localnet';
  private endpoint?: string;
  private provider?: any;

  constructor(config: VerdictAIConfig) {
    this.chain = config.chain === 'localnet' ? 'localnet' : 'testnetBradbury';
    this.endpoint = config.endpoint || undefined;
    this.provider = config.provider || undefined;
    const chain = this.chain === 'localnet' ? localnet : testnetBradbury;

    this.client = createClient({
      chain,
      endpoint: this.endpoint,
      provider: this.provider,
    });

    this.contractAddress = config.contractAddress as Address;
  }

  // ── Write Methods ──────────────────────────────────────────────────────

  /**
   * Submit a new dispute as Party A (claimant).
   * 
   * @param walletAddress - The sender's wallet address
   * @param params - Dispute submission parameters
   * @returns Transaction hash
   * 
   * @example
   * ```typescript
   * const tx = await vai.submitDispute('0xMyWallet...', {
   *   category: 'freelance',
   *   title: 'Website Payment Dispute',
   *   description: 'Developer completed work, client refuses payment',
   *   claimantName: 'Alice',
   *   claim: 'I delivered all 5 pages as agreed',
   *   evidenceHash: 'QmEvidence123abc',
   *   respondentAddress: '0xBobAddress...',
   *   respondentName: 'Bob',
   *   stakeAmount: 1000000n,
   * });
   * console.log('Transaction:', tx);
   * ```
   */
  async submitDispute(walletAddress: string, params: SubmitDisputeParams): Promise<string> {
    return this._writeContract(walletAddress, 'submit_dispute', [
      params.category,
      params.title,
      params.description,
      params.claimantName,
      params.claim,
      params.evidenceHash,
      params.respondentAddress,
      params.respondentName,
      params.stakeAmount,
    ], params.stakeAmount);
  }

  /**
   * Respond to a dispute as Party B (respondent).
   * 
   * @param walletAddress - The respondent's wallet address
   * @param params - Response parameters
   * @returns Transaction hash
   */
  async respondToDispute(walletAddress: string, params: RespondToDisputeParams): Promise<string> {
    return this._writeContract(walletAddress, 'respond_to_dispute', [
      params.disputeId,
      params.claim,
      params.evidenceHash,
      params.respondentName,
      params.stakeAmount,
    ], params.stakeAmount);
  }

  /**
   * Request AI verdict through GenLayer validator consensus.
   * This triggers 5 independent AI validators to analyze the dispute
   * and reach consensus on the outcome.
   * 
   * @param walletAddress - The caller's wallet address
   * @param disputeId - The dispute to evaluate
   * @returns Transaction hash
   */
  async requestVerdict(walletAddress: string, disputeId: string): Promise<string> {
    return this._writeContract(walletAddress, 'request_ai_verdict', [disputeId]);
  }

  /**
   * Withdraw escrowed funds after verdict is finalized.
   * 
   * @param walletAddress - The winner's wallet address
   * @param disputeId - The dispute to claim funds from
   * @returns Transaction hash
   */
  async withdrawFunds(walletAddress: string, disputeId: string): Promise<string> {
    return this._writeContract(walletAddress, 'withdraw_funds', [disputeId]);
  }

  /**
   * Appeal a verdict. Can only be used once per dispute.
   * Triggers a re-evaluation by AI validators.
   * 
   * @param walletAddress - The losing party's wallet address
   * @param disputeId - The dispute to appeal
   * @returns Transaction hash
   */
  async appealVerdict(walletAddress: string, disputeId: string): Promise<string> {
    return this._writeContract(walletAddress, 'appeal_verdict', [disputeId]);
  }

  // ── Read Methods ───────────────────────────────────────────────────────

  /**
   * Get full dispute status including parties, claims, and verdict.
   * 
   * @param disputeId - The dispute ID (e.g., "DSP-1")
   * @returns Full dispute status object
   * 
   * @example
   * ```typescript
   * const dispute = await vai.getDisputeStatus('DSP-1');
   * console.log(dispute.status);    // 'verdict'
   * console.log(dispute.verdict);   // { winner: 'A', confidence: 85, ... }
   * ```
   */
  async getDisputeStatus(disputeId: string): Promise<DisputeStatus> {
    const result = await this._readContract('get_dispute_status', [disputeId]);
    return JSON.parse(result as string) as DisputeStatus;
  }

  /**
   * Get the total number of disputes filed.
   * 
   * @returns Total dispute count
   */
  async getDisputeCount(): Promise<number> {
    const result = await this._readContract('get_dispute_count', []);
    return Number(result);
  }

  /**
   * Resolve the latest dispute ID created by a claimant.
   *
   * @param claimantAddress - The claimant wallet address
   * @returns Latest dispute ID or null when none exists
   */
  async getLatestDisputeIdByClaimant(claimantAddress: string): Promise<string | null> {
    const result = await this._readContract('get_latest_dispute_id_by_claimant', [claimantAddress]);
    const disputeId = String(result ?? '').trim();
    return disputeId || null;
  }

  /**
   * Get just the verdict data for a dispute.
   * 
   * @param disputeId - The dispute ID
   * @returns Verdict object or null if no verdict yet
   */
  async getVerdict(disputeId: string): Promise<Verdict | null> {
    const result = await this._readContract('get_verdict', [disputeId]);
    const parsed = JSON.parse(result as string);
    if (parsed.error) return null;
    return parsed as Verdict;
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  /**
   * Check if the contract is deployed and accessible.
   * 
   * @returns True if the contract responds
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.getDisputeCount();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the contract address.
   */
  getContractAddress(): string {
    return this.contractAddress;
  }

  // ── Internal ───────────────────────────────────────────────────────────

  private async _writeContract(
    walletAddress: string,
    functionName: string,
    args: unknown[],
    value: bigint = 0n
  ): Promise<string> {
    const client = createClient({
      chain: this.chain === 'localnet' ? localnet : testnetBradbury,
      endpoint: this.endpoint,
      provider: this.provider,
      account: walletAddress as Address,
    });

    const txHash = await client.writeContract({
      address: this.contractAddress,
      functionName,
      args: args as CalldataEncodable[],
      value,
    });

    await client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.ACCEPTED,
    });

    return txHash;
  }

  private async _readContract(
    functionName: string,
    args: unknown[]
  ): Promise<unknown> {
    return this.client.readContract({
      address: this.contractAddress,
      functionName,
      args: args as CalldataEncodable[],
    });
  }
}

// ─── Factory Function ───────────────────────────────────────────────────────

/**
 * Create a new VerdictAI SDK instance.
 * 
 * @param config - SDK configuration
 * @returns VerdictAI instance
 * 
 * @example
 * ```typescript
 * import { createVerdictAI } from '@verdictai/sdk';
 * 
 * const vai = createVerdictAI({
 *   contractAddress: '0x2b468A6b65e028c149cbFA0106815039dBED481f',
 * });
 * ```
 */
export function createVerdictAI(config: VerdictAIConfig): VerdictAI {
  return new VerdictAI(config);
}

export default VerdictAI;
