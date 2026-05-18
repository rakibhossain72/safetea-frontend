import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Plus, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Token } from '../../App';
import { useContracts } from '../../hooks/useContracts';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelectToken: (token: Token | null) => void;
  onAddToken?: (token: Token) => void;
  walletAddress?: string;
  placeholder?: string;
}

// Inline ETH logo — used in SubmitTransactionPage, kept here for reuse
export function EthLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="white" fillOpacity="0.6" />
      <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="white" />
      <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="white" fillOpacity="0.6" />
      <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379z" fill="white" />
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="white" fillOpacity="0.2" />
      <path d="M9 16.22l7.498 4.353v-7.7L9 16.22z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function TokenLogo({ token, size = 32 }: { token: Token; size?: number }) {
  const [imgError, setImgError] = useState(false);
  if (token.logoURI && !imgError) {
    return (
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={size}
        height={size}
        className="rounded-full object-contain"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {token.symbol.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  onAddToken,
  walletAddress = '',
  placeholder = 'Select a token',
}: TokenSelectorProps) {
  const { getTokenInfo } = useContracts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importAddress, setImportAddress] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<Token | null>(null);
  const [importError, setImportError] = useState('');
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Decide whether to open upward based on available space below the trigger
  const handleOpen = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 340); // 340px ≈ max dropdown height
    }
    setIsOpen(v => !v);
  };

  // Reset import state when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setShowImport(false);
      setImportAddress('');
      setImportResult(null);
      setImportError('');
    }
  }, [isOpen]);

  const filtered = tokens.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportSearch = async () => {
    const addr = importAddress.trim();
    if (addr.length !== 42 || !addr.startsWith('0x')) {
      setImportError('Enter a valid 0x contract address');
      return;
    }
    if (tokens.find(t => t.address.toLowerCase() === addr.toLowerCase())) {
      setImportError('Token already in your list');
      return;
    }
    setImportLoading(true);
    setImportError('');
    setImportResult(null);
    try {
      const info = await getTokenInfo(addr, walletAddress || '0x0000000000000000000000000000000000000000');
      if (!info) { setImportError('Not a valid ERC-20 contract'); return; }
      setImportResult({
        address: addr,
        name: info.name,
        symbol: info.symbol,
        decimals: info.decimals,
        balance: info.balance,
      });
    } catch {
      setImportError('Failed to fetch token data');
    } finally {
      setImportLoading(false);
    }
  };

  const handleAddImported = () => {
    if (!importResult) return;
    onAddToken?.(importResult);
    onSelectToken(importResult);
    setIsOpen(false);
  };

  const select = (token: Token) => { onSelectToken(token); setIsOpen(false); };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      >
        <div className="flex items-center gap-3">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 flex-shrink-0">
                <TokenLogo token={selectedToken} size={32} />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium leading-none mb-0.5">{selectedToken.symbol}</p>
                <p className="text-gray-500 text-xs">{selectedToken.name}</p>
              </div>
            </>
          ) : (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute left-0 right-0 z-50 rounded-2xl border border-white/[0.08] bg-[#0d0d12] shadow-2xl shadow-black/60 overflow-hidden flex flex-col ${
          dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
        }`} style={{ maxHeight: 'min(340px, 70vh)' }}>

          {/* Search bar */}
          <div className="p-3 border-b border-white/[0.06] flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                autoFocus
                placeholder="Search by name, symbol or address…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          {/* Token list */}
          <div className="overflow-y-auto flex-1 min-h-0">
            {filtered.length > 0 ? (
              filtered.map(token => (
                <button
                  key={token.address}
                  type="button"
                  onClick={() => select(token)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] transition-colors ${
                    selectedToken?.address === token.address ? 'bg-purple-500/[0.08]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      <TokenLogo token={token} size={32} />
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium leading-none mb-0.5">{token.symbol}</p>
                      <p className="text-gray-500 text-xs">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-mono">{parseFloat(token.balance).toFixed(4)}</p>
                    {selectedToken?.address === token.address && (
                      <CheckCircle className="h-3.5 w-3.5 text-purple-400 ml-auto mt-0.5" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500 text-sm">No tokens match "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Import section */}
          <div className="border-t border-white/[0.06] flex-shrink-0">
            {!showImport ? (
              <button
                type="button"
                onClick={() => setShowImport(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-purple-400 hover:text-purple-300 hover:bg-white/[0.03] transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Import custom token
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-xs font-medium">Import by contract address</p>
                  <button type="button" onClick={() => setShowImport(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    placeholder="0x…"
                    value={importAddress}
                    onChange={e => { setImportAddress(e.target.value); setImportError(''); setImportResult(null); }}
                    onKeyDown={e => e.key === 'Enter' && handleImportSearch()}
                    className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleImportSearch}
                    disabled={importLoading || !importAddress}
                    className="px-3 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 disabled:opacity-40 transition-colors"
                  >
                    {importLoading
                      ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                      : <Search className="h-3.5 w-3.5 text-white" />
                    }
                  </button>
                </div>

                {importError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    {importError}
                  </div>
                )}

                {importResult && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/[0.07] border border-green-500/20">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-white text-xs font-medium">{importResult.name}</p>
                        <p className="text-gray-500 text-[11px]">{importResult.symbol} · {importResult.decimals} decimals</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImported}
                      className="px-3 py-1.5 rounded-lg bg-green-600/80 hover:bg-green-600 text-white text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
