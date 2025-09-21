# SafeTea Multi-Signature Wallet

A modern, secure multi-signature wallet built with React, TypeScript, and Solidity smart contracts.

## ✨ Features

- **Multi-Signature Security**: Require multiple confirmations for transactions
- **Smart Contract Integration**: Fully integrated with on-chain SafeTea contracts
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live transaction status and wallet data
- **Owner Management**: Add/remove wallet owners through proposals
- **Token Support**: Send ETH and ERC-20 tokens
- **Transaction History**: Complete audit trail of all transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Web3 wallet (MetaMask, WalletConnect, etc.)
- ETH for gas fees (testnet recommended for development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd safetea-multisig-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your contract addresses and WalletConnect project ID

5. Start the development server:
```bash
npm run dev
```

## 🔧 Contract Integration

This application is fully integrated with smart contracts. See [INTEGRATION.md](./INTEGRATION.md) for detailed setup instructions.

### Key Integration Points

- **No Dummy Data**: All wallet and transaction data comes from blockchain
- **Real Transactions**: Actual on-chain multi-sig transactions
- **Live Updates**: Real-time blockchain data synchronization
- **Contract Deployment**: Deploy your own SafeTea contracts

## 📱 Usage

1. **Connect Wallet**: Connect your Web3 wallet
2. **Create Safe**: Set up a new multi-signature wallet with your team
3. **Submit Transactions**: Propose transactions that require team approval
4. **Confirm/Reject**: Team members vote on pending transactions
5. **Manage Owners**: Add or remove wallet owners through proposals

## 🏗️ Architecture

### Smart Contracts
- `SafeTeaFactory.sol` - Factory for creating new multi-sig wallets
- `SafeTeaWallet.sol` - Individual multi-signature wallet logic

### Frontend
- React 18 with TypeScript
- Wagmi for Web3 integration
- TanStack Query for data management
- Tailwind CSS for styling
- React Router for navigation

### Key Hooks
- `useContracts()` - Contract interaction logic
- `useSafeWallets()` - Wallet data management
- Real-time blockchain data synchronization

## 🔒 Security Features

- **Multi-signature**: Configurable confirmation thresholds
- **Time-locked Transactions**: Expiry mechanisms for proposals
- **Owner Proposals**: Secure owner management system
- **Gas Optimization**: Efficient contract interactions
- **Input Validation**: Comprehensive form validation

## 🌐 Network Support

- Ethereum Mainnet
- Sepolia Testnet (recommended for development)
- Easily configurable for additional networks

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── configs/            # Configuration files
├── lib/                # Utility functions
└── App.tsx             # Main application component

contracts/
├── SafeTeaFactory.sol  # Factory contract
├── SafeTeaWallet.sol   # Wallet contract
└── Interfaces/         # Contract interfaces
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:
- Check [INTEGRATION.md](./INTEGRATION.md) for setup help
- Review contract documentation in `/contracts`
- Open an issue for bugs or feature requests

## 🔮 Roadmap

- [ ] Mobile app support
- [ ] Advanced transaction batching
- [ ] Multi-network support
- [ ] Enhanced token management
- [ ] Governance features
- [ ] Advanced analytics dashboard

---

Built with ❤️ for the Web3 community