# Ω Olympus Smart Contracts 
![image](https://img.shields.io/github/forks/OlympusDAO/olympus-contracts?style=social)

This is the main Olympus smart contract development repository.

## 🚨 warning 
> This fork modified the contract, some tests may not work properly

## This fork modify
- about auth
- some deploy script

### Requirements

-   [node v14](https://nodejs.org/download/release/latest-v14.x/)
-   [git](https://git-scm.com/downloads)

### Local Setup Steps

```sh
# Clone the repository
git clone https://github.com/OlympusDAO/olympus-contracts.git

# Install dependencies
yarn install

# Set up environment variables (keys)
cp .env.example .env # (linux)
copy .env.example .env # (windows)

# compile solidity, the below will automatically also run yarn typechain
yarn compile

# if you want to explicitly run typechain, run
yarn compile --no-typechain
yarn typechain

# run a local hardhat node
yarn run start

# test deployment or deploy 
# yarn run deploy:<network>, example:
yarn run deploy:hardhat
```

### Notes
- The bond must be created after the treasury `deposit()`, otherwise, `terms.ontrolvariable` must be 0