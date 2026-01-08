import { User, Clock } from "lucide-react";

export default function TicketList({ tickets, search }) {
  const filteredTickets = [...tickets] // ✅ CLONE ke array JS
    .sort((a, b) => Number(b.issuedAt) - Number(a.issuedAt))
    .filter((t) =>
      t.participantName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if (filteredTickets.length === 0) {
    return <p style={{ opacity: 0.6 }}>Peserta tidak ditemukan</p>;
  }

  return (
    <div className="list">
      {filteredTickets.map((t) => (
        <div className="ticket-card" key={t.ticketId}>
          <div className="ticket-header">
            <span className="ticket-id">🎟 #{t.ticketId}</span>
          </div>

          <h4>
            <User size={16} /> {t.participantName}
          </h4>

          <small>
            <Clock size={14} />
            {new Date(Number(t.issuedAt) * 1000).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
