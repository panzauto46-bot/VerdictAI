import {
  BrowserProvider,
  Contract,
  type InterfaceAbi,
  formatEther,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from 'ethers';
import { ActionReceipt, Dispute, DisputeResponseInput, NewDisputeInput, ServiceMode } from '../types/dispute';
import { appConfig, hasConfiguredContract, hasConfiguredGenLayerContract } from './appConfig';
import { readGenLayerContract, writeGenLayerContract } from './genlayerClient';
import { getEthereumProvider } from '../utils/wallet';

type ContractAction = 'submit_dispute' | 'respond_to_dispute' | 'request_ai_verdict' | 'withdraw_funds' | 'appeal_verdict';

function buildDemoTxHash(seed: string): string {
  return keccak256(toUtf8Bytes(`${seed}-${Date.now()}-${Math.random()}`));
}

function buildExplorerUrl(txHash: string): string | undefined {
  if (!appConfig.txExplorerBaseUrl) {
    return undefined;
  }

  return `${appConfig.txExplorerBaseUrl}/${txHash}`;
}

const legacyMethodNameMap: Record<ContractAction, string> = {
  submit_dispute: 'submitDispute',
  respond_to_dispute: 'respondToDispute',
  request_ai_verdict: 'requestAIVerdict',
  withdraw_funds: 'withdrawFunds',
  appeal_verdict: 'appealVerdict',
};

function buildReceipt(
  mode: ServiceMode,
  txHash: string,
  message: string,
  extras?: Partial<ActionReceipt>
): ActionReceipt {
  return {
    mode,
    txHash,
    explorerUrl: buildExplorerUrl(txHash),
    message,
    ...extras,
  };
}

async function simulateAction(seed: string, message: string, mode: ServiceMode = 'demo'): Promise<ActionReceipt> {
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  return buildReceipt(mode, buildDemoTxHash(seed), message);
}

async function signActionReceipt(action: ContractAction, payload: object, walletAddress: string): Promise<ActionReceipt> {
  const provider = getEthereumProvider();
  if (!provider) {
    return simulateAction(`${action}-demo`, `${action} recorded in demo mode.`, 'demo');
  }

  const message = JSON.stringify({
    app: 'VerdictAI',
    action,
    walletAddress,
    payload,
    timestamp: new Date().toISOString(),
  });

  const signature = await provider.request({
    method: 'personal_sign',
    params: [message, walletAddress],
  }) as string;

  return buildReceipt(
    'wallet',
    keccak256(toUtf8Bytes(signature)),
    `${action} captured as a wallet-signed receipt.`
  );
}

function normalizeErrorMessage(message: string): string {
  const trimmed = message.trim();
  const lowered = trimmed.toLowerCase();

  if (!trimmed) {
    return 'Unknown error';
  }

  if (
    lowered.includes('insufficient funds')
    || lowered.includes('insufficient balance')
    || lowered.includes('exceeds balance')
    || lowered.includes('not enough balance')
  ) {
    return 'Insufficient GEN balance. Please top up your wallet and retry.';
  }

  if (
    lowered.includes('user rejected')
    || lowered.includes('user denied')
    || lowered.includes('rejected the request')
    || lowered.includes('transaction was rejected')
  ) {
    return 'Transaction was cancelled in your wallet.';
  }

  if (lowered.includes('unsupported network')) {
    return 'Wallet is connected to an unsupported network. Switch to GenLayer Studio Network and retry.';
  }

  if (lowered.includes('finalized without a successful execution')) {
    return 'GenLayer finalized the transaction, but smart-contract execution failed. Check balance, input fields, and chain configuration.';
  }

  if (lowered.includes('execution reverted:')) {
    const revertReason = trimmed.split(/execution reverted:/i)[1]?.trim();
    if (revertReason) {
      return `Transaction reverted: ${revertReason}`;
    }
  }

  return trimmed;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return normalizeErrorMessage(error.message);
  }

  if (typeof error === 'string') {
    return normalizeErrorMessage(error);
  }

  return normalizeErrorMessage('Unknown error');
}

async function getWalletBalanceWei(walletAddress: string): Promise<bigint | null> {
  const provider = getEthereumProvider();
  if (!provider) {
    return null;
  }

  try {
    const balance = await provider.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest'],
    });

    if (typeof balance === 'string') {
      return BigInt(balance);
    }
  } catch {
    return null;
  }

  return null;
}

function shouldRequireStrictLiveWrite(walletAddress: string | null): boolean {
  return Boolean(walletAddress && getEthereumProvider() && hasConfiguredGenLayerContract());
}

async function resolveCanonicalDisputeId(walletAddress: string): Promise<string | undefined> {
  try {
    const result = await readGenLayerContract('get_latest_dispute_id_by_claimant', [walletAddress], walletAddress);
    if (typeof result !== 'string') {
      throw new Error('Claimant dispute lookup returned a non-string result');
    }

    const disputeId = result.trim();
    if (disputeId) {
      return disputeId;
    }
  } catch {
    // Fall back to the simpler Studio-safe contract shape that only exposes the dispute count.
  }

  try {
    const count = await readGenLayerContract('get_dispute_count');
    if (typeof count === 'bigint') {
      return `DSP-${count.toString()}`;
    }

    if (typeof count === 'number') {
      return `DSP-${String(count)}`;
    }

    if (typeof count === 'string') {
      const trimmed = count.trim();
      if (trimmed) {
        return `DSP-${trimmed}`;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

async function attemptContractWrite(
  action: ContractAction,
  walletAddress: string,
  args: unknown[],
  valueEth?: number,
  options?: { strictGenLayer?: boolean }
): Promise<ActionReceipt | null> {
  let genLayerError: unknown;
  const txValueWei = valueEth && valueEth > 0 ? parseEther(valueEth.toFixed(6)) : 0n;

  if (txValueWei > 0n) {
    const walletBalanceWei = await getWalletBalanceWei(walletAddress);
    if (walletBalanceWei !== null && walletBalanceWei < txValueWei) {
      throw new Error(
        `Insufficient balance. Required ${formatEther(txValueWei)} GEN, available ${formatEther(walletBalanceWei)} GEN.`
      );
    }
  }

  try {
    const genLayerTxHash = await writeGenLayerContract(
      walletAddress,
      action,
      args,
      txValueWei > 0n ? txValueWei : undefined
    );

    if (genLayerTxHash) {
      return buildReceipt('genlayer', genLayerTxHash, `${action} broadcast through the GenLayerJS client.`);
    }
  } catch (error) {
    genLayerError = error;
  }

  if (options?.strictGenLayer) {
    throw new Error(`GenLayer write failed for ${action}: ${getErrorMessage(genLayerError)}`);
  }

  if (!hasConfiguredContract()) {
    return null;
  }

  const provider = getEthereumProvider();
  if (!provider) {
    return null;
  }

  try {
    const browserProvider = new BrowserProvider(provider);
    const signer = await browserProvider.getSigner(walletAddress);
    const contract = new Contract(appConfig.contractAddress, (appConfig.contractAbi ?? []) as InterfaceAbi, signer);
    const method = contract[action] ?? contract[legacyMethodNameMap[action]];

    if (typeof method !== 'function') {
      return null;
    }

    const tx = await method(...args, txValueWei > 0n ? { value: txValueWei } : undefined);
    await tx.wait();

    return buildReceipt('contract', tx.hash as string, `${action} broadcast to the configured contract.`);
  } catch {
    return null;
  }
}

export async function submitDisputeAction(
  disputeId: string,
  input: NewDisputeInput,
  walletAddress: string | null,
  options?: { forceDemo?: boolean }
): Promise<ActionReceipt> {
  if (options?.forceDemo) {
    return simulateAction(
      `${disputeId}-demo`,
      'Dispute submitted in demo mode fallback (no on-chain write).',
      'demo'
    );
  }

  const stakeWei = parseEther(input.stakeAmount.toFixed(6));
  const args = [
    input.category,
    input.title,
    input.description ?? input.claim,
    input.claimantName ?? 'Claimant',
    input.claim,
    input.evidence?.hash ?? input.evidenceHash ?? '',
    input.respondentAddress,
    input.respondentName ?? 'Respondent',
    stakeWei,
  ];

  if (walletAddress) {
    const contractReceipt = await attemptContractWrite(
      'submit_dispute',
      walletAddress,
      args,
      input.stakeAmount,
      { strictGenLayer: shouldRequireStrictLiveWrite(walletAddress) }
    );
    if (contractReceipt) {
      const contractDisputeId = await resolveCanonicalDisputeId(walletAddress);
      if (contractReceipt.mode === 'genlayer' && !contractDisputeId) {
        throw new Error('GenLayer submission succeeded, but the app could not resolve the on-chain dispute ID.');
      }

      return contractDisputeId
        ? { ...contractReceipt, contractDisputeId }
        : contractReceipt;
    }

    return signActionReceipt('submit_dispute', { disputeId, ...input }, walletAddress);
  }

  return simulateAction(disputeId, 'Dispute submitted in demo mode.');
}

export async function respondToDisputeAction(
  dispute: Dispute,
  input: DisputeResponseInput,
  walletAddress: string | null
): Promise<ActionReceipt> {
  const stakeWei = parseEther(input.stakeAmount.toFixed(6));
  const args = [
    dispute.id,
    input.claim,
    input.evidence?.hash ?? input.evidenceHash ?? '',
    input.respondentName ?? 'Respondent',
    stakeWei,
  ];

  if (walletAddress) {
    const contractReceipt = await attemptContractWrite(
      'respond_to_dispute',
      walletAddress,
      args,
      input.stakeAmount,
      { strictGenLayer: shouldRequireStrictLiveWrite(walletAddress) }
    );
    if (contractReceipt) {
      return contractReceipt;
    }

    return signActionReceipt('respond_to_dispute', { disputeId: dispute.id, ...input }, walletAddress);
  }

  return simulateAction(`${dispute.id}-respond`, 'Respondent submission recorded in demo mode.');
}

export async function requestVerdictAction(dispute: Dispute, walletAddress: string | null): Promise<ActionReceipt> {
  const args = [dispute.id];

  if (walletAddress) {
    const contractReceipt = await attemptContractWrite(
      'request_ai_verdict',
      walletAddress,
      args,
      undefined,
      { strictGenLayer: shouldRequireStrictLiveWrite(walletAddress) }
    );
    if (contractReceipt) {
      return contractReceipt;
    }

    return signActionReceipt('request_ai_verdict', { disputeId: dispute.id }, walletAddress);
  }

  return simulateAction(`${dispute.id}-verdict`, 'AI verdict requested in demo mode.');
}

export async function claimFundsAction(dispute: Dispute, walletAddress: string | null): Promise<ActionReceipt> {
  const args = [dispute.id];

  if (walletAddress) {
    const contractReceipt = await attemptContractWrite(
      'withdraw_funds',
      walletAddress,
      args,
      undefined,
      { strictGenLayer: shouldRequireStrictLiveWrite(walletAddress) }
    );
    if (contractReceipt) {
      return contractReceipt;
    }

    return signActionReceipt('withdraw_funds', { disputeId: dispute.id }, walletAddress);
  }

  return simulateAction(`${dispute.id}-claim`, 'Fund release recorded in demo mode.');
}

export async function appealVerdictAction(dispute: Dispute, walletAddress: string | null): Promise<ActionReceipt> {
  const args = [dispute.id];

  if (walletAddress) {
    const contractReceipt = await attemptContractWrite(
      'appeal_verdict',
      walletAddress,
      args,
      undefined,
      { strictGenLayer: shouldRequireStrictLiveWrite(walletAddress) }
    );
    if (contractReceipt) {
      return contractReceipt;
    }

    return signActionReceipt('appeal_verdict', { disputeId: dispute.id }, walletAddress);
  }

  return simulateAction(`${dispute.id}-appeal`, 'Appeal recorded in demo mode.');
}
