import { BrowserProvider, Contract, type InterfaceAbi, keccak256, parseEther, toUtf8Bytes } from 'ethers';
import { ActionReceipt, Dispute, DisputeResponseInput, NewDisputeInput, ServiceMode } from '../types/dispute';
import { appConfig, hasConfiguredContract } from './appConfig';
import { writeGenLayerContract } from './genlayerClient';
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

function buildReceipt(mode: ServiceMode, txHash: string, message: string): ActionReceipt {
  return {
    mode,
    txHash,
    explorerUrl: buildExplorerUrl(txHash),
    message,
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

async function attemptContractWrite(
  action: ContractAction,
  walletAddress: string,
  args: unknown[],
  valueEth?: number
): Promise<ActionReceipt | null> {
  try {
    const genLayerTxHash = await writeGenLayerContract(
      walletAddress,
      action,
      args,
      valueEth && valueEth > 0 ? parseEther(valueEth.toFixed(6)) : undefined
    );

    if (genLayerTxHash) {
      return buildReceipt('genlayer', genLayerTxHash, `${action} broadcast through the GenLayerJS client.`);
    }
  } catch {
    // Fall through to any configured ethers-style adapter.
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
    const method = contract[action];

    if (typeof method !== 'function') {
      return null;
    }

    const tx = await method(...args, valueEth && valueEth > 0 ? { value: parseEther(valueEth.toFixed(6)) } : undefined);
    await tx.wait();

    return buildReceipt('contract', tx.hash as string, `${action} broadcast to the configured contract.`);
  } catch {
    return null;
  }
}

export async function submitDisputeAction(
  disputeId: string,
  input: NewDisputeInput,
  walletAddress: string | null
): Promise<ActionReceipt> {
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
    const contractReceipt = await attemptContractWrite('submit_dispute', walletAddress, args);
    if (contractReceipt) {
      return contractReceipt;
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
    const contractReceipt = await attemptContractWrite('respond_to_dispute', walletAddress, args);
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
    const contractReceipt = await attemptContractWrite('request_ai_verdict', walletAddress, args);
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
    const contractReceipt = await attemptContractWrite('withdraw_funds', walletAddress, args);
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
    const contractReceipt = await attemptContractWrite('appeal_verdict', walletAddress, args);
    if (contractReceipt) {
      return contractReceipt;
    }

    return signActionReceipt('appeal_verdict', { disputeId: dispute.id }, walletAddress);
  }

  return simulateAction(`${dispute.id}-appeal`, 'Appeal recorded in demo mode.');
}
