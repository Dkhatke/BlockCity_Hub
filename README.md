
# 🏙️ BlockCity Hub — Web3 dApp (Sepolia Testnet)

Welcome to **BlockCity Hub** 🚀  
This is a complete Web3 dApp built during the BlockCity Workshop.

It connects to **4 Smart Contracts deployed on Sepolia Testnet**:

1. 🏛 City Foundation (Base Contract)
2. 💰 Treasury (ERC-20 Token)
3. 🪪 Identity (NFT Badges)
4. 🗳 Council (On-chain Voting / DAO)

---

# 📦 Project Structure

```

BLOCKCITY/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   │
│   └── js/
│       ├── app.js
│       │
│       ├── config/
│       │   └── contracts.js
│       │
│       ├── core/
│       │   ├── connect.js
│       │   ├── helpers.js
│       │   ├── loader.js
│       │   └── state.js
│       │
│       └── rooms/
│           ├── room1.foundation.js
│           ├── room2.treasury.js
│           ├── room3.identity.js
│           └── room4.council.js

```

---

# 🛠 Requirements (Beginner Setup Guide)

## 1️⃣ Install VS Code

Download:
https://code.visualstudio.com/

---

## 2️⃣ Install Live Server Extension

In VS Code:

- Go to Extensions
- Search for **Live Server**
- Install it

---

## 3️⃣ Install MetaMask

Download:
https://metamask.io/

- Create a wallet
- Save your Secret Recovery Phrase safely

---

## 4️⃣ Add Sepolia Testnet

In MetaMask:

- Click Network dropdown
- Enable "Show test networks"
- Select **Sepolia**

---

## 5️⃣ Get Free Sepolia ETH (For Gas Fees)

Use a faucet:

https://sepoliafaucet.com/

Paste your wallet address and request ETH.

You need Sepolia ETH to:

- Mint tokens
- Create proposals
- Vote
- Mint NFTs

---

#  How To Run The Project

### Step 1
Open the BLOCKCITY folder in VS Code.

### Step 2
Right-click `index.html`.

### Step 3
Click **"Open with Live Server"**

Do NOT open with file://  
Modules require a local server.

---

# 🔧 Connect Your Smart Contracts

Open:

```

assets/js/config/contracts.js

```

Replace:

```

0xYOUR_ROOM1_ADDRESS_HERE
0xYOUR_ROOM2_ADDRESS_HERE
0xYOUR_ROOM3_ADDRESS_HERE
0xYOUR_ROOM4_ADDRESS_HERE

```

With your actual deployed contract addresses from Remix.

---

#  How The Architecture Works

This project uses modular structure:

### 🔹 config/
Contains contract addresses and ABIs.

### 🔹 core/
Contains:
- Wallet connection
- Global state
- Shared helper functions
- Data loader

### 🔹 rooms/
Each smart contract has its own JS file.

Room files contain:
- Read functions
- Write functions
- UI interaction logic

###  app.js
Main entry file that connects everything together.

---

# Smart Contracts Overview

## Room 1 — City Foundation
- View platform name
- Update city name

## Room 2 — Treasury (ERC-20)
- Mint tokens
- Reward users
- View balance

## Room 3 — Identity (NFT)
- Mint badge NFT
- Lookup owner
- View metadata URI

## Room 4 — Council (DAO)
- Create proposal
- Vote YES / NO
- Check results
- Execute proposal

---

#  Common Errors & Fixes

## Page is blank

Make sure:

- You are using Live Server
- styles.css exists in `assets/css/`
- No red errors in DevTools console (F12)

---

## MetaMask not found

Make sure:
- MetaMask extension installed
- Using Chrome or Brave
- MetaMask unlocked

---

##  Not enough gas

Get more Sepolia ETH from faucet.

---

##  Contract not found

Make sure:
- You pasted correct contract addresses
- Contracts are deployed on Sepolia
- MetaMask is connected to Sepolia

---

#  How To Add New Functionality

1. Add a new function in Solidity (Remix)
2. Recompile
3. Copy updated ABI
4. Paste ABI into contracts.js
5. Add new function in corresponding room file
6. Add button in HTML

No other changes required.

---

# Deploy Online (Optional)

You can deploy this to:

- https://vercel.com
- https://netlify.com

Just drag the folder and deploy.

Anyone with MetaMask can use your dApp.

---

# Technologies Used

- HTML
- CSS
- JavaScript (ES Modules)
- Ethers.js v6
- MetaMask
- Sepolia Testnet

No frameworks.
No backend.
Fully client-side Web3 dApp.

---

# 🎓 Learning Goals

By completing this project, you understand:

- How frontend connects to smart contracts
- How to use Ethers.js
- How to structure Web3 projects
- How to deploy dApps
- How DAOs work
- How NFTs work
- How ERC-20 tokens work

---

# 🏁 Final Note

This is not just a workshop demo.

This is real Web3 architecture.

You can expand this into:

- A marketplace
- A DAO governance system
- A token economy
- A student certificate system
- A voting app
- A startup MVP

Build boldly 🚀
```

---

# ✅ What This README Covers

✔ Folder structure
✔ Beginner setup
✔ MetaMask setup
✔ Sepolia faucet
✔ Live Server instructions
✔ Common errors
✔ Deployment
✔ Architecture explanation
✔ Expansion guide


