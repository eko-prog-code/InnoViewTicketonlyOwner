import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getReadContract, getWriteContract } from "./blockchain/contract";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import { Wallet, LogOut } from "lucide-react";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const isOwner =
    account && owner && account.toLowerCase() === owner.toLowerCase();

  /* ✅ LOAD DATA TANPA WALLET */
  const loadTickets = async () => {
    try {
      const contract = getReadContract();
      const data = await contract.getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data blockchain");
    }
  };

  const loadOwner = async () => {
    try {
      const contract = getReadContract();
      const ownerAddr = await contract.owner();
      setOwner(ownerAddr);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Gunakan MetaMask / browser wallet");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const mintTicket = async (name) => {
    try {
      const contract = await getWriteContract();
      const tx = await contract.issueTicket(name);
      await tx.wait();
      loadTickets();
    } catch (err) {
      alert("Mint gagal");
    }
  };

  useEffect(() => {
    loadTickets();
    loadOwner();
  }, []);

  return (
    <div className="container">
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

      {isOwner && <TicketForm onMint={mintTicket} />}

      <div className="list-header">
        <input
          className="search"
          placeholder="Cari nama peserta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <TicketList tickets={tickets} search={search} />
      )}
    </div>
  );
}
