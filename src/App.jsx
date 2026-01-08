import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  getReadContract,
  getWriteContract
} from "./blockchain/contract";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import { LogOut, Wallet } from "lucide-react";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const [search, setSearch] = useState("");

  const isOwner =
    account && owner && account.toLowerCase() === owner.toLowerCase();

  const loadTickets = async () => {
    const contract = getReadContract();
    const data = await contract.getAllTickets();
    setTickets(data);
  };

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const mintTicket = async (name) => {
    const contract = await getWriteContract();
    const tx = await contract.issueTicket(name);
    await tx.wait();
    loadTickets();
  };

  useEffect(() => {
    loadTickets();
    getReadContract().owner().then(setOwner);
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header>
        <div>
          <h2>🎟 Ticket InnoView Academy</h2>
          <small>Basic Programmer – Mengenal Teknologi Web</small>
        </div>

        {!account ? (
          <button onClick={connectWallet} className="btn-primary">
            <Wallet size={16} /> Connect Wallet
          </button>
        ) : (
          <div className="account-box">
            <span className={isOwner ? "owner" : "guest"}>
              {isOwner ? "Owner" : "Account Tamu"}
            </span>
            <small>{account}</small>
            <button onClick={disconnectWallet} className="btn-danger">
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        )}
      </header>

      {/* OWNER FORM */}
      {isOwner && <TicketForm onMint={mintTicket} />}

      {/* SEARCH + LINK */}
      <div className="list-header">
        <input
          className="search"
          placeholder="Cari nama peserta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <a
          href="https://eth-sepolia.blockscout.com/address/0x92228f213CCE1b317f112bd09C70E03e73c77095"
          target="_blank"
        >
          View Blockchain ↗
        </a>
      </div>

      {/* LIST */}
      <TicketList tickets={tickets} search={search} />
    </div>
  );
}
