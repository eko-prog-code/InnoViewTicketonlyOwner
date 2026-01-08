import { ethers } from "ethers";

export const CONTRACT_ADDRESS =
  "0x92228f213CCE1b317f112bd09C70E03e73c77095";

export const ABI = [
  // ABI PERSIS DARI ANDA (tidak diubah)
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
        "internalType":"struct TicketInnoViewAcademy.Ticket[]",
        "name":"",
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  { "inputs":[], "name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

export const getReadContract = () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

export const getWriteContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};
