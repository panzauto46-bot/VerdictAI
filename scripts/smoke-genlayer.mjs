import fs from 'node:fs';
import path from 'node:path';
import { createClient } from 'genlayer-js';
import { localnet, studionet, testnetAsimov, testnetBradbury } from 'genlayer-js/chains';

const CHAIN_MAP = {
  localnet,
  studionet,
  testnetAsimov,
  testnetBradbury,
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      env[key] = value;
      return env;
    }, {});
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function normalizeEndpoint(value) {
  if (!value) {
    return '';
  }

  const trimmed = trimTrailingSlash(value);

  try {
    const url = new URL(trimmed);
    if (url.hostname === 'studio.genlayer.com' && (url.pathname === '' || url.pathname === '/')) {
      url.pathname = '/api';
    }
    return trimTrailingSlash(url.toString());
  } catch {
    return trimmed;
  }
}

const repoRoot = process.cwd();
const productionEnv = parseEnvFile(path.join(repoRoot, '.env.production'));
const localEnv = parseEnvFile(path.join(repoRoot, '.env.local'));
const mergedEnv = {
  ...productionEnv,
  ...localEnv,
  ...process.env,
};

const configuredChainName = mergedEnv.VITE_GENLAYER_CHAIN || 'studionet';
const configuredChain = CHAIN_MAP[configuredChainName] || studionet;
const endpoint = normalizeEndpoint(mergedEnv.VITE_GENLAYER_ENDPOINT);
const contractAddress = mergedEnv.VITE_GENLAYER_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error('VITE_GENLAYER_CONTRACT_ADDRESS is required for the GenLayer smoke check.');
}

if (!endpoint) {
  throw new Error('VITE_GENLAYER_ENDPOINT is required for the GenLayer smoke check.');
}

const client = createClient({
  chain: configuredChain,
  endpoint,
});

const disputeCount = await client.readContract({
  address: contractAddress,
  functionName: 'get_dispute_count',
  args: [],
});

console.log(`GenLayer smoke check passed.`);
console.log(`Chain: ${configuredChainName}`);
console.log(`Endpoint: ${endpoint}`);
console.log(`Contract: ${contractAddress}`);
console.log(`Dispute count: ${String(disputeCount)}`);
