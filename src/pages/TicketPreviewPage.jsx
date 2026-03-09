import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById } from '../db';
import Navbar from '../components/Navbar';
import PremiumTicketCard from '../components/PremiumTicketCard';

export default function TicketPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const t = getTicketById(id);
    setTicket(t);
  }, [id]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-dark-900 bg-mesh">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="glass-card neon-border p-8 text-center max-w-md">
            <span className="text-5xl block mb-4">❌</span>
            <h2 className="text-xl font-display font-bold text-white mb-2">Ticket Not Found</h2>
            <p className="text-white/50 mb-6">This ticket doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/seller')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => navigate('/seller')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-display font-bold text-white">
            Ticket <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Share this ticket with the buyer</p>
        </div>

        {/* Premium Ticket */}
        <PremiumTicketCard ticket={ticket} ticketId={id} />

        {/* Create Another */}
        <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            id="create-another-btn"
            onClick={() => navigate('/seller/new-ticket')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Another Ticket
          </button>
        </div>
      </main>
    </div>
  );
}
