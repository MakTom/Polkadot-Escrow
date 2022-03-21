# Escrow Contract Project

This project demonstrates a role based escrow contract. It comes with hardhat, a test for that contract, a sample script that deploys that contract.

You need to have 3 accounts configured in your Metamask wallets to be used as Agent, Sender, Receiver as per the logic of Escrow service. You need to switch accounts while performing the escrow action based on the logic below.

Sender - (Send Payment, Confirm Delivery, Deny Delivery)

Receiver - (Claim Payment)

Agent - (Agent Transfer)

You can modify the deply script to provide Sender, Receiver address, price and the lock period.

## Backend
- to install required modules:
```shell
npm install
```
- to compile contract:
```shell
npx hardhat compile
```


- to deploy contract in moonbase:
```shell
npx hardhat run --network moonbase scripts/deploy.js
```

## Frontend
### Interacting with escrow contract
This project was bootstrapped with React App


- to install required modules:
```shell
npm install
```
Also make sure the update the address of the deployed contract in the App.js file.

- to run:
```shell
npm start
```
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

