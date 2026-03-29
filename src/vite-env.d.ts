/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PINATA_JWT?: string;
  readonly VITE_IPFS_GATEWAY_URL?: string;
  readonly VITE_TX_EXPLORER_URL?: string;
  readonly VITE_GENLAYER_CHAIN?: string;
  readonly VITE_GENLAYER_ENDPOINT?: string;
  readonly VITE_GENLAYER_CONTRACT_ADDRESS?: string;
  readonly VITE_GENLAYER_VERDICT_API_URL?: string;
  readonly VITE_GENLAYER_VERDICT_API_KEY?: string;
  readonly VITE_VERDICTAI_CONTRACT_ADDRESS?: string;
  readonly VITE_VERDICTAI_CONTRACT_ABI_JSON?: string;
  readonly VITE_VERDICTAI_ENABLE_CONTRACT_WRITES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
