import React from 'react';
import { Token } from '../App';
import { useTokenBalance } from '../hooks/useTokenBalance';

interface TokenBalanceCardProps {
  token: Token;
  walletAddress: string;
}

export function TokenBalanceCard({ token, walletAddress }: TokenBalanceCardProps) {
  const { balance, isLoading } = useTokenBalance(token.address, walletAddress, token.decimals);
  
  const displayBalance = isLoading ? '...' : parseFloat(balance).toFixed(4);
  const usdValue = parseFloat(balance) * (token.symbol === 'USDC' || token.symbol === 'USDT' || token.symbol === 'DAI' ? 1 : 100);

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {token.logoURI ? (
            <img src={token.logoURI} alt={token.symbol} className="w-8 h-8" />
          ) : (
            <span className="text-white font-bold text-xs">{token.symbol.slice(0, 3)}</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{token.name}</p>
          <p className="text-gray-400 text-sm">{token.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-medium">{displayBalance}</p>
          <p className="text-gray-400 text-sm">
            ${usdValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}