import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not defined");
}

const abi = [
  "function claimHello() public returns (uint256)",
  "function getPoints(address) public view returns (uint256)",
];

export async function claimHello(): Promise<number> {
  // The browser may not expose `ethereum` on the global `window` object
  // in a type‑safe way. We cast to `any` to avoid a TypeScript error.
  if (!(window as any).ethereum) {
    throw new Error("No wallet connected");
  }

  // Use the browser provider (window.ethereum) to get a signer
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, abi, signer);

  const tx = await contract.claimHello();
  await tx.wait();

  const points = await contract.getPoints(await signer.getAddress());
  return points.toNumber();
}
