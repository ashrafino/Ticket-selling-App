import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getTicketsBySeller } from '../db';
import Navbar from '../components/Navbar';

export default function SellerDashboard() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const tickets = getTicketsBySeller(currentUser.id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTickets = tickets.filter(t =>
      new Date(t.createdAt) >= todayStart
    );

    setStats({ today: todayTickets.length, total: tickets.length });
    setRecentTickets(tickets.slice(-5).reverse());
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome back, <span className="gradient-text">{userData?.displayName || 'Seller'}</span>
          </h1>
          <p className="text-white/40 mt-1">Manage your ticket sales</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <span className="text-white/50 text-sm">Today's Sales</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.today}</p>
          </div>
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <span className="text-xl">🎫</span>
              </div>
              <span className="text-white/50 text-sm">Total Tickets Sold</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.total}</p>
          </div>
        </div>

        {/* Create Ticket Button */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/seller/new-ticket" className="btn-primary inline-flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Ticket
          </Link>
        </div>

        {/* Recent Tickets */}
        <div className="glass-card neon-border overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-display font-semibold text-white">Recent Tickets</h2>
          </div>
          {recentTickets.length === 0 ? (
            <div className="p-8 text-center text-white/30">
              <span className="text-4xl block mb-2">🎫</span>
              No tickets yet. Create your first ticket!
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTickets.map(ticket => (
                <Link
                  key={ticket.id}
                  to={`/seller/ticket/${ticket.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{ticket.buyerName}</p>
                    <p className="text-white/40 text-sm">{ticket.filiere} · {ticket.games?.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.verified
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    }`}>
                      {ticket.verified ? '✓ Verified' : 'Active'}
                    </span>
                    <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
