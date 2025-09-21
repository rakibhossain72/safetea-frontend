import { useAccount, usePublicClient, useWalletClient, useReadContract, useWriteContract } from 'wagmi';
import { getContract, parseEther, formatEther } from 'viem';
import { useQuery } from '@tanstack/react-query';

// Complete SafeTea Factory ABI
export const SAFETEA_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "address[]", "name": "owners", "type": "address[]" }
    ],
    "name": "createWallet",
    "outputs": [{ "internalType": "address", "name": "walletAddress", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserWallets",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllWallets",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "newOwners", "type": "address[]" }
    ],
    "name": "updateWalletOwners",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "isSafeTeaWallet",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "address[]", "name": "owners", "type": "address[]" }
    ],
    "name": "WalletCreated",
    "type": "event"
  }
] as const;

// Complete SafeTea Wallet ABI
export const SAFETEA_WALLET_ABI = [
  {
    "inputs": [],
    "name": "getOwners",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwnerCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMajorityThreshold",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" },
      { "internalType": "uint256", "name": "_expiry", "type": "uint256" }
    ],
    "name": "submitTransaction",
    "outputs": [{ "internalType": "uint256", "name": "txIndex", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "txIndex", "type": "uint256" }
    ],
    "name": "confirmTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "txIndex", "type": "uint256" }
    ],
    "name": "rejectTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTransactionCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "index", "type": "uint256" }
    ],
    "name": "getTransaction",
    "outputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" },
      { "internalType": "bool", "name": "executed", "type": "bool" },
      { "internalType": "bool", "name": "canceled", "type": "bool" },
      { "internalType": "uint256", "name": "confirmations", "type": "uint256" },
      { "internalType": "uint256", "name": "rejections", "type": "uint256" },
      { "internalType": "uint256", "name": "expiry", "type": "uint256" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" },
      { "internalType": "uint8", "name": "proposalType", "type": "uint8" },
      { "internalType": "uint256", "name": "_expiry", "type": "uint256" }
    ],
    "name": "proposeOwner",
    "outputs": [{ "internalType": "uint256", "name": "proposalIndex", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalIndex", "type": "uint256" }
    ],
    "name": "confirmOwnerProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "isOwner",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "txIndex", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "hasConfirmedTransaction",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "txIndex", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "hasRejectedTransaction",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract addresses
export const SAFETEA_FACTORY_ADDRESS = import.meta.env.VITE_SAFETEA_FACTORY_ADDRESS || '0x45BDcD1E36f649331Cf41A2B9925D74F332b0F6F';

export interface SafeWalletData {
  address: string;
  owners: string[];
  threshold: number;
  balance: string;
  transactionCount: number;
  isOwner: boolean;
}

export interface TransactionData {
  index: number;
  to: string;
  value: string;
  data: string;
  executed: boolean;
  canceled: boolean;
  confirmations: number;
  rejections: number;
  expiry: number;
  createdAt: number;
  hasConfirmed?: boolean;
  hasRejected?: boolean;
  nonce?: number;
  submittedBy?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export function useContracts() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContract } = useWriteContract();

  const factoryContract = publicClient && getContract({
    address: SAFETEA_FACTORY_ADDRESS as `0x${string}`,
    abi: SAFETEA_FACTORY_ABI,
    client: publicClient,
  });

  const getWalletContract = (walletAddress: string) => {
    if (!publicClient) return null;
    
    return getContract({
      address: walletAddress as `0x${string}`,
      abi: SAFETEA_WALLET_ABI,
      client: publicClient,
    });
  };

  // Get user's wallets
  const { data: userWallets, refetch: refetchUserWallets } = useReadContract({
    address: SAFETEA_FACTORY_ADDRESS as `0x${string}`,
    abi: SAFETEA_FACTORY_ABI,
    functionName: 'getUserWallets',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Create wallet function
  const createWallet = async (owners: string[]) => {
    if (!writeContract) throw new Error('Wallet not connected');
    
    return writeContract({
      address: SAFETEA_FACTORY_ADDRESS as `0x${string}`,
      abi: SAFETEA_FACTORY_ABI,
      functionName: 'createWallet',
      args: [owners as `0x${string}`[]],
    });
  };

  // Get wallet details
  const getWalletDetails = async (walletAddress: string): Promise<SafeWalletData | null> => {
    if (!publicClient || !address) return null;

    try {
      const walletContract = getWalletContract(walletAddress);
      if (!walletContract) return null;

      const [owners, threshold, transactionCount, balance, isOwnerResult] = await Promise.all([
        walletContract.read.getOwners(),
        walletContract.read.getMajorityThreshold(),
        walletContract.read.getTransactionCount(),
        publicClient.getBalance({ address: walletAddress as `0x${string}` }),
        walletContract.read.isOwner([address]),
      ]);

      return {
        address: walletAddress,
        owners: owners as string[],
        threshold: Number(threshold),
        balance: formatEther(balance),
        transactionCount: Number(transactionCount),
        isOwner: isOwnerResult as boolean,
      };
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      return null;
    }
  };

  // Get wallet transactions
  const getWalletTransactions = async (walletAddress: string): Promise<TransactionData[]> => {
    if (!publicClient || !address) return [];

    try {
      const walletContract = getWalletContract(walletAddress);
      if (!walletContract) return [];

      const transactionCount = await walletContract.read.getTransactionCount();
      const transactions: TransactionData[] = [];



      for (let i = 0; i < Number(transactionCount); i++) {
        const [to, value, data, executed, canceled, confirmations, rejections, expiry, createdAt] = 
          await walletContract.read.getTransaction([BigInt(i)]);
        

          console.log(to, value, data, executed, canceled, confirmations, rejections, expiry, createdAt)

        const [hasConfirmed, hasRejected] = await Promise.all([
          walletContract.read.hasConfirmedTransaction([BigInt(i), address]),
          walletContract.read.hasRejectedTransaction([BigInt(i), address]),
        ]);

  

        const submittedBy = '0x0000000000000000000000000000000000000000';

        transactions.push({
          index: i,
          to: to as string,
          value: formatEther(value as bigint),
          data: data as string,
          executed: executed as boolean,
          canceled: canceled as boolean,
          confirmations: Number(confirmations),
          rejections: Number(rejections),
          expiry: Number(expiry),
          createdAt: Number(createdAt),
          hasConfirmed: hasConfirmed as boolean,
          hasRejected: hasRejected as boolean,
          nonce: i,
          submittedBy: submittedBy,
          gasLimit: '21000', // Default gas limit for ETH transfers
          gasPrice: '20 gwei', // Default gas price
        });
      }

      return transactions.reverse(); // Show newest first
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  // Submit transaction
  const submitTransaction = async (
    walletAddress: string,
    to: string,
    value: string,
    data: string = '0x',
    expiryDays: number = 7
  ) => {
    if (!writeContract) throw new Error('Wallet not connected');
    
    const expiry = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);
    
    return writeContract({
      address: walletAddress as `0x${string}`,
      abi: SAFETEA_WALLET_ABI,
      functionName: 'submitTransaction',
      args: [
        to as `0x${string}`,
        parseEther(value),
        data as `0x${string}`,
        BigInt(expiry),
      ],
    });
  };

  // Confirm transaction
  const confirmTransaction = async (walletAddress: string, txIndex: number) => {
    if (!writeContract) throw new Error('Wallet not connected');
    
    return writeContract({
      address: walletAddress as `0x${string}`,
      abi: SAFETEA_WALLET_ABI,
      functionName: 'confirmTransaction',
      args: [BigInt(txIndex)],
    });
  };

  // Reject transaction
  const rejectTransaction = async (walletAddress: string, txIndex: number) => {
    if (!writeContract) throw new Error('Wallet not connected');
    
    return writeContract({
      address: walletAddress as `0x${string}`,
      abi: SAFETEA_WALLET_ABI,
      functionName: 'rejectTransaction',
      args: [BigInt(txIndex)],
    });
  };

  return {
    factoryContract,
    getWalletContract,
    publicClient,
    walletClient,
    userAddress: address,
    userWallets: userWallets as string[] | undefined,
    refetchUserWallets,
    createWallet,
    getWalletDetails,
    getWalletTransactions,
    submitTransaction,
    confirmTransaction,
    rejectTransaction,
  };
}