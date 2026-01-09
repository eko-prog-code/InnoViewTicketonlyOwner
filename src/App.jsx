import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Wallet, LogOut } from "lucide-react";

import { getReadContract, getWriteContract } from "./blockchain/contract";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import TicketStat from "./components/TicketStat";

export default function App() {
  /* ================= STATE ================= */
  const [tickets, setTickets] = useState([]);
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  /* ================= CONFIG ================= */
  const TOTAL_QUOTA = 20;

  /* ================= DERIVED ================= */
  const isOwner =
    account && owner && account.toLowerCase() === owner.toLowerCase();

  /* ================= LOAD DATA (PUBLIC) ================= */
  const loadTickets = async () => {
    try {
      const contract = getReadContract();
      const data = await contract.getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error("LOAD TICKETS ERROR:", err);
      setError("Gagal memuat data dari blockchain");
    }
  };

  const loadOwner = async () => {
    try {
      const contract = getReadContract();
      const ownerAddr = await contract.owner();
      setOwner(ownerAddr);
    } catch (err) {
      console.error("LOAD OWNER ERROR:", err);
    }
  };

  /* ================= WALLET ================= */
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Wallet tidak ditemukan. Gunakan MetaMask / Wallet Browser");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  /* ================= WRITE ================= */
  const mintTicket = async (name) => {
    try {
      const contract = await getWriteContract();
      const tx = await contract.issueTicket(name);
      await tx.wait();
      loadTickets();
    } catch (err) {
      console.error("MINT ERROR:", err);
      alert("Mint ticket gagal");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    loadTickets();
    loadOwner();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <header>
        <div>
          <h2>🎟 Ticket InnoView Academy</h2>
          <p className="subtitle">
            Basic Programmer – Mengenal Teknologi Web
          </p>

          <p className="scarcity">
            Scarcity Ticket = Blockchain for Ticket Development
            <br />
            <span>Data immutable • Limited • Tidak dapat diubah (tetap)</span>
          </p>
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

      {/* ================= STAT ================= */}
      <TicketStat
        quota={TOTAL_QUOTA}
        issued={tickets.length}
      />

      {/* ================= OWNER FORM ================= */}
      {isOwner && <TicketForm onMint={mintTicket} />}

      {/* ================= SEARCH ================= */}
      <div className="list-header">
        <input
          className="search"
          placeholder="Cari nama peserta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= LIST ================= */}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <TicketList tickets={tickets} search={search} />
      )}
    </div>
  );
}
