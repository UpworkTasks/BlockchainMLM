# Polygon MLM Smart Contract

This repository contains a smart contract for a Multi-Level Marketing (MLM) system on the Polygon blockchain. The system allows users to register, refer others, and earn rewards based on an 8-level referral structure.

## Features

- User registration with referral tracking
- 8 levels of hierarchy with increasing prices
- Automatic referral overflow system
- Decentralized payment distribution
- Direct peer-to-peer transactions between participants
- System-assigned referrals when needed

## How The System Works

### Initial Setup

- The contract deployer (owner) is the first participant in the pyramid structure
- **The owner does not need to pay any fee to participate in the system**
- The first participants who join without specifying a referrer are automatically placed under the owner
- As more users join, the pyramid grows organically according to the referral rules

### Step 1: Registration

- User signs up by connecting their Polygon wallet and paying 200 POL
- The 200 POL registration fee goes directly to their first-line upline
- User is assigned Level 1 in the system

### Step 2: Login

- Users log in to their account via Polygon wallet (like MetaMask)
- No password required - all data is stored on the blockchain
- Account cannot be hacked or blocked by anyone

### Step 3: Inviting Referrals

There are three ways to get referrals:

1. Invite referrals personally
2. Get referrals from uplines via overflow
3. Receive free referrals from the system

After filling 3 direct referral slots, any additional referrals overflow to your downline.

### Step 4: Income Structure

- Level 1: Receive 200 POL from each of 3 direct referrals (600 POL total)
- Level 2: After paying 600 POL to second-line upline, receive 200 POL from 9 second-level referrals (1,800 POL)
- Level 3: After paying 1,800 POL to third-line upline, receive 200 POL from 27 third-level referrals (5,400 POL)
- Level 4: After paying 5,400 POL, receive 200 POL from 81 referrals (16,200 POL)
- Level 5: After paying 16,200 POL, receive 200 POL from 243 referrals (48,600 POL)
- Level 6: After paying 48,600 POL, receive 200 POL from 729 referrals (145,800 POL)
- Level 7: After paying 145,800 POL, receive 200 POL from 2,187 referrals (437,400 POL)
- Level 8: After paying 437,400 POL, receive 200 POL from 6,561 referrals (1,312,200 POL)

## Smart Contract Details

The MLM system is implemented as a Polygon smart contract with the following level pricing:

- Level 1: 200 POL (registration cost)
- Level 2: 600 POL
- Level 3: 1,800 POL
- Level 4: 5,400 POL
- Level 5: 16,200 POL
- Level 6: 48,600 POL
- Level 7: 145,800 POL
- Level 8: 437,400 POL

## Benefits of Polygon MLM Smart Contract

- Full decentralization
- Absence of risks
- System automatically brings free referrals
- Referrals from uplines (overflow)
- Unable to stop the system (blockchain-based)
- Inactive referrals multiply your profit
- All transactions are direct between participants
- Annual recurring profit potential

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- Truffle v5.7+
- MetaMask or another wallet with Polygon support

### Installation

1. Clone this repository

```
git clone https://github.com/your-username/blockchain-mlm.git
cd blockchain-mlm
```

2. Install dependencies

```
npm install
```

3. Copy `.env.example` to `.env` and fill in your details

```
cp .env.example .env
```

4. Compile the contracts

```
npm run compile
```

### Deployment

#### Local Development

```
npm run migrate
```

#### Polygon Mumbai Testnet

```
npm run deploy:mumbai
```

#### Polygon Mainnet

```
npm run deploy:polygon
```

### Contract Verification

After deployment, you can verify the contract on PolygonScan:

```
npm run verify:mumbai
```

or

```
npm run verify:polygon
```

## Contract Usage

### Registration

To register with the MLM system, call the `register` function with your referrer's address and send 200 POL.

### Buying Levels

After registration, you can buy the next level by calling the `buyLevel` function with the level number and sending the appropriate amount of POL.

### Getting User Details

You can check a user's status by calling the `getUserDetails` function with their address.

## Security Considerations

1. The contract does not store or require users' private keys
2. All transactions are handled directly on the blockchain
3. Only the contract owner can execute emergency functions
4. Users maintain full control of their funds at all times

## License

This project is licensed under the MIT License.
