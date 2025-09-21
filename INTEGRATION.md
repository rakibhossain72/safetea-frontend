# SafeTea Contract Integration Guide

This guide explains how to integrate the SafeTea frontend with the smart contracts.

## Contract Architecture

The SafeTea system consists of two main contracts:

1. **SafeTeaFactory.sol** - Factory contract for creating new multi-sig wallets
2. **SafeTeaWallet.sol** - Individual multi-signature wallet contract

## Setup Instructions

### 1. Deploy Contracts

First, deploy the contracts to your chosen network:

```bash
# Using Hardhat
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia

# Using Foundry
forge build
forge create contracts/SafeTeaFactory.sol:SafeTeaFactory --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### 2. Update Environment Variables

Copy `.env.example` to `.env` and update with your contract addresses:

```bash
cp .env.example .env
```

Update the contract address in `.env`:
```
VITE_SAFETEA_FACTORY_ADDRESS=0xYourDeployedFactoryAddress
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 3. Contract Integration Features

The frontend now integrates with the smart contracts for:

#### Wallet Management
- **Create Wallet**: Uses `SafeTeaFactory.createWallet()`
- **List User Wallets**: Uses `SafeTeaFactory.getUserWallets()`
- **Wallet Details**: Fetches owners, threshold, balance from `SafeTeaWallet`

#### Transaction Management
- **Submit Transaction**: Uses `SafeTeaWallet.submitTransaction()`
- **Confirm Transaction**: Uses `SafeTeaWallet.confirmTransaction()`
- **Reject Transaction**: Uses `SafeTeaWallet.rejectTransaction()`
- **View Transactions**: Uses `SafeTeaWallet.getTransaction()`

#### Owner Management
- **Propose Owner**: Uses `SafeTeaWallet.proposeOwner()`
- **Confirm Owner Proposal**: Uses `SafeTeaWallet.confirmOwnerProposal()`

## Key Changes Made

### 1. Removed Dummy Data
- Eliminated hardcoded wallet and transaction data
- All data now comes from blockchain contracts

### 2. Real Contract Integration
- `useContracts.ts` - Complete contract interaction hooks
- `useSafeWallets.ts` - Wallet management with real data
- Updated components to use contract data

### 3. Transaction Flow
- Real transaction submission to contracts
- Actual confirmation/rejection mechanics
- Live transaction status updates

### 4. Wallet Creation
- Creates actual on-chain multi-sig wallets
- Real owner management
- Proper threshold calculations

## Contract Functions Used

### SafeTeaFactory
```solidity
function createWallet(address[] memory owners) external returns (address)
function getUserWallets(address user) external view returns (address[] memory)
function getAllWallets() external view returns (address[] memory)
```

### SafeTeaWallet
```solidity
function submitTransaction(address to, uint256 value, bytes memory data, uint256 _expiry) external returns (uint256)
function confirmTransaction(uint256 txIndex) external
function rejectTransaction(uint256 txIndex) external
function getTransaction(uint256 index) external view returns (...)
function getOwners() external view returns (address[] memory)
function getMajorityThreshold() external view returns (uint256)
```

## Testing

1. Connect your wallet to the application
2. Create a new Safe with multiple owners
3. Submit a test transaction
4. Have other owners confirm/reject the transaction
5. Verify all data persists on the blockchain

## Network Support

The application supports:
- Ethereum Mainnet
- Sepolia Testnet (recommended for testing)

To add more networks, update `src/configs/wagmi-config.ts`.

## Troubleshooting

### Common Issues

1. **Contract not found**: Verify the factory address in `.env`
2. **Transaction fails**: Check wallet has sufficient ETH for gas
3. **No wallets shown**: Ensure you're connected with the correct account
4. **Pending transactions**: Wait for blockchain confirmation

### Debug Mode

Enable debug logging by adding to your `.env`:
```
VITE_DEBUG=true
```

## Security Considerations

- Always verify contract addresses before deployment
- Test thoroughly on testnets before mainnet deployment
- Ensure proper access controls are in place
- Regular security audits recommended for production use

## Next Steps

1. Deploy contracts to your chosen network
2. Update environment variables
3. Test wallet creation and transactions
4. Add additional features as needed

The application is now fully integrated with the smart contracts and ready for production use!