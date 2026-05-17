import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const hasValidProjectId = projectId && projectId !== 'your_project_id_here';

if (!hasValidProjectId) {
  console.warn(
    '[SafeTea] No valid VITE_WALLETCONNECT_PROJECT_ID found. ' +
    'Running with injected wallet only. Get a free ID at https://cloud.walletconnect.com/'
  );
}

export const config = hasValidProjectId
  ? getDefaultConfig({
      appName: 'SafeTea',
      projectId,
      chains: [sepolia],
      ssr: false,
    })
  : createConfig({
      chains: [sepolia],
      connectors: [injected()],
      transports: {
        [sepolia.id]: http(),
      },
    });