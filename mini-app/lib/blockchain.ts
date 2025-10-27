import { ethers } from "ethers";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const abi = [
  "function claimHello() public returns (uint256)",
  "function getPoints(address) public view returns (uint256)",
];

export async function claimHello(): Promise<number> {
  if (!window.ethereum) {
    throw new Error("No wallet connected");
  }
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.claimHello();
  await tx.wait();
  const points = await contract.getPoints(await signer.getAddress());
  return points.toNumber();
}
