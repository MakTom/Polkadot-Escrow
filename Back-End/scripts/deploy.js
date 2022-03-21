async function main() {
  const EscrowService = await hre.ethers.getContractFactory("EscrowService");
  const escrowService = await EscrowService.deploy("0x2EF50BC35a028AFC9Ed74984424eFc99F71EE61f","0x5fA589455C2E4a1998FD4B14C2Ea7B77fC49fD8B", 100000, 120);
  await escrowService .deployed();  //0x5fA589455C2E4a1998FD4B14C2Ea7B77fC49fD8B
  console.log("EscrowService deployed to:",escrowService.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


 