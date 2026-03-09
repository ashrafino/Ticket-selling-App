import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, getSellers, createSeller, deleteSeller } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const TICKET_PRICE = 50; // MAD per ticket — adjust as needed

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showCreateSeller, setShowCreateSeller] = useState(false);
  const [sellerForm, setSellerForm] = useState({ email: '', password: '', displayName: '' });
  const [sellerError, setSellerError] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  function refreshData() {
    setTickets(getTickets());
    setSellers(getSellers());
  }

  // ----------- Derived Stats -----------
  const totalRevenue = tickets.length * TICKET_PRICE;
  const verifiedCount = tickets.filter(t => t.verified).length;

  const sellerStats = sellers.map(s => {
    const sellerTickets = tickets.filter(t => t.sellerId === s.id);
    return {
      ...s,
      ticketCount: sellerTickets.length,
      revenue: sellerTickets.length * TICKET_PRICE,
    };
  });

  // ----------- Create Seller -----------
  function handleCreateSeller(e) {
    e.preventDefault();
    setSellerError('');

    try {
      createSeller({
        email: sellerForm.email,
        password: sellerForm.password,
        displayName: sellerForm.displayName,
      });
      setSellerForm({ email: '', password: '', displayName: '' });
      setShowCreateSeller(false);
      refreshData();
    } catch (err) {
      setSellerError(err.message);
    }
  }

  function handleDeleteSeller(sellerId) {
    if (!window.confirm('Are you sure you want to remove this seller?')) return;
    deleteSeller(sellerId);
    refreshData();
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-white/40 mt-1">Overview of all sales and sellers</p>
          </div>
          <Link
            to="/admin/scanner"
            id="open-scanner-btn"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Scanner
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                <span className="text-xl">🎫</span>
              </div>
              <span className="text-white/50 text-sm">Total Tickets</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{tickets.length}</p>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-white/50 text-sm">Total Revenue</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{totalRevenue} MAD</p>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <span className="text-white/50 text-sm">Verified</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{verifiedCount} / {tickets.length}</p>
          </div>
        </div>

        {/* Seller Stats Table */}
        <div className="glass-card neon-border overflow-hidden mb-8 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-display font-semibold text-white">Sellers</h2>
            <button
              id="create-seller-btn"
              onClick={() => setShowCreateSeller(!showCreateSeller)}
              className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Seller
            </button>
          </div>

          {/* Create Seller Form */}
          {showCreateSeller && (
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] animate-fade-in">
              <form onSubmit={handleCreateSeller} className="space-y-4">
                {sellerError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {sellerError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    id="seller-name-input"
                    type="text"
                    value={sellerForm.displayName}
                    onChange={e => setSellerForm(p => ({ ...p, displayName: e.target.value }))}
                    className="input-field"
                    placeholder="Display Name"
                    required
                  />
                  <input
                    id="seller-email-input"
                    type="email"
                    value={sellerForm.email}
                    onChange={e => setSellerForm(p => ({ ...p, email: e.target.value }))}
                    className="input-field"
                    placeholder="Email"
                    required
                  />
                  <input
                    id="seller-password-input"
                    type="password"
                    value={sellerForm.password}
                    onChange={e => setSellerForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-success text-sm px-4 py-2">
                    Create Seller
                  </button>
                  <button type="button" onClick={() => setShowCreateSeller(false)} className="btn-secondary text-sm px-4 py-2">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {sellers.length === 0 ? (
            <div className="p-8 text-center text-white/30">
              <span className="text-4xl block mb-2">👥</span>
              No sellers yet. Create one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Name</th>
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Email</th>
                    <th className="px-6 py-3 text-center text-xs text-white/30 uppercase tracking-wider font-medium">Tickets</th>
                    <th className="px-6 py-3 text-center text-xs text-white/30 uppercase tracking-wider font-medium">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs text-white/30 uppercase tracking-wider font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sellerStats.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium">{s.displayName}</td>
                      <td className="px-6 py-4 text-sm text-white/50">{s.email}</td>
                      <td className="px-6 py-4 text-sm text-white text-center">{s.ticketCount}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400 text-center font-semibold">{s.revenue} MAD</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteSeller(s.id)}
                          className="text-red-400/60 hover:text-red-400 transition-colors text-sm"
                          title="Remove Seller"
                        >
                          <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Tickets */}
        <div className="glass-card neon-border overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-display font-semibold text-white">All Tickets</h2>
          </div>
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-white/30">
              <span className="text-4xl block mb-2">🎫</span>
              No tickets created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Filière</th>
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Activities</th>
                    <th className="px-6 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-medium">Seller</th>
                    <th className="px-6 py-3 text-center text-xs text-white/30 uppercase tracking-wider font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-white font-medium">{t.buyerName}</p>
                        <p className="text-xs text-white/30">{t.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{t.filiere}</td>
                      <td className="px-6 py-4 text-sm text-white/60">{t.games?.join(', ')}</td>
                      <td className="px-6 py-4 text-sm text-white/60">{t.sellerName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.verified
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                        }`}>
                          {t.verified ? '✓ Verified' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
