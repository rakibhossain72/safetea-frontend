import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// Standard ERC-20 ABI for balance checking
const ERC20_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useTokenBalance(tokenAddress: string, walletAddress: string, decimals: number = 18) {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [walletAddress as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!walletAddress,
    },
  });

  const formattedBalance = balance ? formatUnits(balance as bigint, decimals) : '0';

  return {
    balance: formattedBalance,
    rawBalance: balance,
    isLoading,
    refetch,
  };
}