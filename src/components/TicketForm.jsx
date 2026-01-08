import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function TicketForm({ onMint }) {
  const [name, setName] = useState("");

  const handleMint = () => {
    if (!name.trim()) {
      alert("Nama peserta wajib diisi");
      return;
    }

    onMint(name.trim());
    setName("");
  };

  return (
    <div className="card">
      <h3>Mint Ticket (Owner)</h3>

      <input
        type="text"
        placeholder="Nama Peserta"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleMint} disabled={!name.trim()}>
        <UserPlus size={16} />
        Mint Ticket
      </button>
    </div>
  );
}
