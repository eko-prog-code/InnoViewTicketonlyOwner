import { Ticket, CheckCircle, Hourglass } from "lucide-react";

export default function TicketStat({ quota, issued }) {
  const remaining = quota - issued;

  return (
    <div className="stat-grid">
      <div className="stat-card">
        <Ticket size={22} />
        <span className="stat-label">Kuota</span>
        <strong>{quota}</strong>
      </div>

      <div className="stat-card">
        <CheckCircle size={22} />
        <span className="stat-label">Terbit</span>
        <strong>{issued}</strong>
      </div>

      <div className="stat-card">
        <Hourglass size={22} />
        <span className="stat-label">Sisa</span>
        <strong>{remaining < 0 ? 0 : remaining}</strong>
      </div>
    </div>
  );
}
