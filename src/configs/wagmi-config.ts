import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SafeTea Wallet',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f5a2b1c8d3e4f5a6b7c8d9e0f1a2b3c',
  chains: [mainnet, sepolia],
  ssr: false,
});