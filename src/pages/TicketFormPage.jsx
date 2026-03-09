import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const GAME_OPTIONS = [
  {
    id: 'ps5_fc26',
    label: 'Tournois PS5 FC 26',
    icon: '🎮',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'billard',
    label: 'Billard',
    icon: '🎱',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'espace_chill',
    label: "L'Espace Chill — Uno / Jeux de Société / Mafia",
    icon: '🃏',
    color: 'from-purple-500 to-pink-500',
  },
];

const FILIERE_OPTIONS = ['ISIAM', 'Polytechnique'];

export default function TicketFormPage() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const [form, setForm] = useState({
    buyerName: '',
    filiere: '',
    phone: '',
    games: [],
  });
  const [error, setError] = useState('');

  function handleGameToggle(gameId) {
    setForm(prev => {
      const selected = prev.games.includes(gameId)
        ? prev.games.filter(g => g !== gameId)
        : prev.games.length < 2
          ? [...prev.games, gameId]
          : prev.games;
      return { ...prev, games: selected };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.buyerName.trim()) return setError('Full name is required.');
    if (!form.filiere) return setError('Please select a Filière.');
    if (!form.phone.trim()) return setError('Phone number is required.');
    if (form.games.length === 0) return setError('Select at least one game or activity.');

    try {
      const gameLabels = form.games.map(
        id => GAME_OPTIONS.find(g => g.id === id)?.label || id
      );
      const ticket = createTicket({
        buyerName: form.buyerName.trim(),
        filiere: form.filiere,
        phone: form.phone.trim(),
        games: gameLabels,
        sellerId: currentUser.id,
        sellerName: userData?.displayName || currentUser.email,
      });
      navigate(`/seller/ticket/${ticket.id}`);
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/seller')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-display font-bold text-white">
            New <span className="gradient-text">Ticket</span>
          </h1>
          <p className="text-white/40 mt-1">Register a new buyer for the event</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="glass-card neon-border p-6">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="ticket-name"
              type="text"
              value={form.buyerName}
              onChange={e => setForm(prev => ({ ...prev, buyerName: e.target.value }))}
              className="input-field"
              placeholder="Enter buyer's full name"
              required
            />
          </div>

          {/* Filière */}
          <div className="glass-card neon-border p-6">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Filière <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                id="ticket-filiere"
                value={form.filiere}
                onChange={e => setForm(prev => ({ ...prev, filiere: e.target.value }))}
                className="select-field"
                required
              >
                <option value="" disabled>Select a Filière</option>
                {FILIERE_OPTIONS.map(f => (
                  <option key={f} value={f} className="bg-dark-800 text-white">{f}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="glass-card neon-border p-6">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              id="ticket-phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field"
              placeholder="+212 6XX XX XX XX"
              required
            />
          </div>

          {/* Game Selection */}
          <div className="glass-card neon-border p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-white/60">
                Game Selection <span className="text-red-400">*</span>
              </label>
              <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
                {form.games.length} / 2 max
              </span>
            </div>
            <div className="space-y-3">
              {GAME_OPTIONS.map(game => {
                const isSelected = form.games.includes(game.id);
                const isDisabled = !isSelected && form.games.length >= 2;
                return (
                  <button
                    key={game.id}
                    type="button"
                    id={`game-${game.id}`}
                    onClick={() => handleGameToggle(game.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                      ${isSelected
                        ? 'bg-white/10 border-neon-blue/50 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
                        : isDisabled
                          ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20 cursor-pointer'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${isSelected ? `bg-gradient-to-br ${game.color} shadow-lg` : 'bg-white/5'}
                    `}>
                      <span className="text-2xl">{game.icon}</span>
                    </div>
                    <span className={`text-left text-sm font-medium ${isSelected ? 'text-white' : 'text-white/60'}`}>
                      {game.label}
                    </span>
                    <div className={`ml-auto w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all
                      ${isSelected
                        ? 'bg-neon-blue border-neon-blue'
                        : 'border-white/20'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            id="ticket-submit"
            type="submit"
            className="btn-success w-full flex items-center justify-center gap-2 text-lg py-4"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generate Ticket
          </button>
        </form>
      </main>
    </div>
  );
}
