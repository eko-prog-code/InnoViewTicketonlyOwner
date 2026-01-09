// src/blockchain/contract.js
import { ethers } from "ethers";

export const CONTRACT_ADDRESS =
  "0x92228f213CCE1b317f112bd09C70E03e73c77095";

// RPC PUBLIC (SEPOLIA)
export const RPC_URL =
  "https://ethereum-sepolia.publicnode.com";

export const ABI = [
  {
    "inputs":[{"internalType":"string","name":"_participantName","type":"string"}],
    "name":"issueTicket",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getAllTickets",
    "outputs":[
      {
        "components":[
          {"internalType":"uint256","name":"ticketId","type":"uint256"},
          {"internalType":"string","name":"participantName","type":"string"},
          {"internalType":"uint256","name":"issuedAt","type":"uint256"}
        ],
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"owner",
    "outputs":[{"type":"address"}],
    "stateMutability":"view",
    "type":"function"
  }
];

/* ✅ READ = RPC (AMAN MOBILE) */
export const getReadContract = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

/* ✅ WRITE = METAMASK */
export const getWriteContract = async () => {
  if (!window.ethereum) {
    throw new Error("Wallet tidak ditemukan");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};
