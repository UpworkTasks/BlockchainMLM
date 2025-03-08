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

### Owner's Earnings in the System

The contract owner has several privileged ways to earn in the MLM system:

1. **Default Upline Position**:

   - When users register without a valid referrer, the owner becomes their upline
   - The owner receives the 200 POL registration fee from these users
   - This is especially beneficial in the early stages when the network is small

2. **Overflow Mechanism Beneficiary**:

   - When the referral overflow algorithm can't find suitable placement in the network
   - New users get placed under the owner as a last resort
   - The owner receives direct referrals without recruitment effort

3. **Higher Level Fallback**:

   - When users purchase higher levels and no upline with that level is found
   - Payments go to the owner as fallback recipient
   - This happens when a user's lineage doesn't have higher level participants

4. **No Registration Fee**:

   - The owner doesn't need to pay the 200 POL registration fee
   - The owner is automatically placed at the top of the pyramid structure
   - This gives the owner an immediate advantage in the system

5. **Emergency Funds Access**:
   - The owner can withdraw any POL accidentally sent directly to the contract
   - This is intended for emergency situations and contract maintenance

These mechanisms ensure the owner has multiple revenue streams within the system, particularly in the early growth stages of the network.

## Detailed Contract Functionality

### User Registration (`register` function)

1. **User Calls Register**:

   - User sends 200 POL with their registration transaction
   - They can specify a referrer (upline) address or let the system assign one

2. **Upline Assignment**:

   - If the specified upline is invalid or none is provided, the system finds an appropriate upline using `findSystemUpline()`
   - The system prioritizes users with fewer referrals to ensure balanced distribution

3. **User Structure Creation**:

   - A new User structure is created for the registered address
   - `registered = true`
   - `upline = assigned_upline_address`
   - `currentLevel = 1`
   - `activeLevel[1] = true`
   - `timestamp = current_block_timestamp`

4. **Payment Processing**:

   - The 200 POL registration fee is transferred directly to the upline
   - The upline's earnings are updated:
     - `totalEarnings += 200 POL`
     - `levelEarnings[1].totalEarned += 200 POL`
     - `levelEarnings[1].referralCount++`

5. **Referral Placement**:
   - User is added to their upline's `directReferrals` array if there's space (less than 3 referrals)
   - If the upline already has 3 referrals, the overflow mechanism places the new user under one of the upline's referrals

### Level Purchase (`buyLevel` function)

1. **User Calls BuyLevel**:

   - User must already be registered
   - Can only buy the next sequential level (e.g., if at Level 2, can only buy Level 3)
   - Must send the exact payment amount for the level

2. **Finding Appropriate Upline**:

   - The system finds an upline who already has the level being purchased using `findUplineForLevel()`
   - This might not be the user's direct upline, but someone further up in their lineage
   - If no appropriate upline is found, the payment goes to the contract owner

3. **Payment Processing**:

   - The level cost is transferred directly to the identified upline
   - The upline's earnings are updated:
     - `totalEarnings += level_price`
     - `levelEarnings[level].totalEarned += level_price`
     - `levelEarnings[level].referralCount++`

4. **User Level Update**:
   - `currentLevel = purchased_level`
   - `activeLevel[purchased_level] = true`

### Overflow Mechanism (In `register` function)

1. **Overflow Trigger**:
   - When a user's direct upline already has 3 referrals
2. **Placement Algorithm**:

   - Searches through upline's referrals for someone with less than 3 referrals
   - Uses a breadth-first search approach through the network
   - If no suitable spot is found after searching the entire network, places user under the owner

3. **Benefits**:
   - Ensures balanced network growth
   - Guarantees placement for every new user
   - Creates automatic "spillover" benefits for active participants

### Earnings Distribution Logic

1. **Direct Payment Model**:

   - All payments are made directly between users (peer-to-peer)
   - The contract does not hold funds except during the transaction processing

2. **Level-specific Earnings**:

   - Users only receive payments for levels they have activated
   - If a user hasn't purchased Level X, they can't receive Level X payments from their downline
   - These payments "skip" to the next eligible upline

3. **Tracking Mechanism**:
   - All earnings are tracked by the contract
   - Each user has detailed records of earnings per level and referral counts

### Smart Contract Owner Functions

1. **Emergency Withdraw**:

   - The owner can withdraw any POL accidentally sent to the contract

2. **Transfer Ownership**:

   - The owner can transfer contract ownership to another address

3. **Default Upline**:
   - The owner serves as the default upline for users who don't specify one or when the system can't find a suitable upline

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

## Technical Implementation Notes

1. **User Data Storage**:

   - All user data is stored on the blockchain
   - Uses mappings and structs for efficient data access
   - Maintains an array of all registered users for system-wide operations

2. **Events**:

   - `Registration`: Emitted when a new user registers
   - `LevelPurchased`: Emitted when a user buys a new level
   - `ReferralAdded`: Emitted when a user is added as someone's referral
   - `PaymentReceived`: Emitted when a user receives a payment

3. **Security Measures**:

   - Function modifiers ensure only eligible users can perform certain actions
   - Input validation prevents incorrect payment amounts
   - Sequential level purchases prevent skipping levels

4. **Deterministic Algorithms**:
   - All placement and payment algorithms are deterministic
   - No random elements ensure predictability and fairness
   - Network growth follows mathematical progression (3^n at each level)

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
