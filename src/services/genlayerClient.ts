import { createClient } from 'genlayer-js';
import { localnet, studionet, testnetAsimov, testnetBradbury } from 'genlayer-js/chains';
import { ExecutionResult, TransactionStatus, type CalldataEncodable } from 'genlayer-js/types';
import { type Address } from 'viem';
import { appConfig, hasConfiguredGenLayerContract } from './appConfig';
import { getEthereumProvider } from '../utils/wallet';

const chainMap = {
  localnet,
  studionet,
  testnetAsimov,
  testnetBradbury,
} as const;

type ChainName = keyof typeof chainMap;

function getConfiguredChain() {
  const requestedChain = appConfig.genLayerChain as ChainName;
  return chainMap[requestedChain] ?? testnetBradbury;
}

function getConfiguredChainName(): ChainName {
  const requestedChain = appConfig.genLayerChain as ChainName;
  return chainMap[requestedChain] ? requestedChain : 'testnetBradbury';
}

export function createConfiguredGenLayerClient(walletAddress?: string) {
  const provider = getEthereumProvider();

  return createClient({
    chain: getConfiguredChain(),
    endpoint: appConfig.genLayerEndpoint || undefined,
    account: walletAddress ? (walletAddress as Address) : undefined,
    provider: provider ?? undefined,
  });
}

export async function prepareGenLayerWallet() {
  const provider = getEthereumProvider();
  if (!provider) {
    return;
  }

  const client = createConfiguredGenLayerClient();
  await client.connect(getConfiguredChainName(), 'npm');
}

export async function getContractSchema(address?: string) {
  const contractAddress = (address ?? appConfig.genLayerContractAddress) as Address | '';
  if (!contractAddress) {
    return null;
  }

  const client = createConfiguredGenLayerClient();
  return client.getContractSchema(contractAddress);
}

export async function writeGenLayerContract(
  walletAddress: string,
  functionName: string,
  args: unknown[],
  value?: bigint
) {
  if (!hasConfiguredGenLayerContract()) {
    return null;
  }

  const client = createConfiguredGenLayerClient(walletAddress);
  const txHash = await client.writeContract({
    address: appConfig.genLayerContractAddress as Address,
    functionName,
    args: args as CalldataEncodable[],
    value: value ?? 0n,
  });

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: TransactionStatus.FINALIZED,
  });

  if (receipt.txExecutionResultName !== ExecutionResult.FINISHED_WITH_RETURN) {
    const executionLabel = receipt.txExecutionResultName ?? 'UNKNOWN';
    throw new Error(`GenLayer transaction finalized without a successful execution (${executionLabel}).`);
  }

  return txHash;
}

export async function readGenLayerContract(functionName: string, args: unknown[] = [], walletAddress?: string) {
  if (!hasConfiguredGenLayerContract()) {
    return null;
  }

  const client = createConfiguredGenLayerClient(walletAddress);
  return client.readContract({
    address: appConfig.genLayerContractAddress as Address,
    functionName,
    args: args as CalldataEncodable[],
  });
}
