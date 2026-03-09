import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  Box, Container, Typography, TextField, Button, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GAME_OPTIONS = [
  { id: 'ps5_fc26', label: 'Tournois PS5 FC 26', icon: '🎮', color: '#3b82f6' },
  { id: 'billard', label: 'Billard', icon: '🎱', color: '#22c55e' },
  { id: 'espace_chill', label: "L'Espace Chill — Uno / Jeux de Société / Mafia", icon: '🃏', color: '#a855f7' },
];

const FILIERE_OPTIONS = ['ISIAM', 'Polytechnique'];

export default function TicketFormPage() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [form, setForm] = useState({ buyerName: '', filiere: '', phone: '', games: [] });
  const [error, setError] = useState('');

  function handleGameToggle(gameId) {
    setForm(prev => {
      const selected = prev.games.includes(gameId)
        ? prev.games.filter(g => g !== gameId)
        : prev.games.length < 2 ? [...prev.games, gameId] : prev.games;
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
      const gameLabels = form.games.map(id => GAME_OPTIONS.find(g => g.id === id)?.label || id);
      const ticket = createTicket({
        buyerName: form.buyerName.trim(), filiere: form.filiere, phone: form.phone.trim(),
        games: gameLabels, sellerId: currentUser.id, sellerName: userData?.displayName || currentUser.email,
      });
      navigate(`/seller/ticket/${ticket.id}`);
    } catch { setError('Failed to create ticket.'); }
  }

  return (
    <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/seller')}
            sx={{ color: 'text.secondary', mb: 2, '&:hover': { color: '#fff' } }}>
            Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            New <span className="gradient-text">Ticket</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Register a new buyer for the event</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {/* Full Name */}
            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)' }}>
              <TextField id="ticket-name" label="Full Name" value={form.buyerName}
                onChange={e => setForm(p => ({ ...p, buyerName: e.target.value }))}
                placeholder="Enter buyer's full name" fullWidth required />
            </Paper>

            {/* Filière */}
            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)' }}>
              <FormControl fullWidth required>
                <InputLabel id="filiere-label" sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#00d4ff' } }}>Filière</InputLabel>
                <Select id="ticket-filiere" labelId="filiere-label" label="Filière"
                  value={form.filiere} onChange={e => setForm(p => ({ ...p, filiere: e.target.value }))}
                  sx={{ borderRadius: 3, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' } }}>
                  {FILIERE_OPTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
            </Paper>

            {/* Phone */}
            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)' }}>
              <TextField id="ticket-phone" label="Phone Number" type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+212 6XX XX XX XX" fullWidth required />
            </Paper>

            {/* Game Selection */}
            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Game Selection *
                </Typography>
                <Chip label={`${form.games.length} / 2 max`} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', fontSize: '0.7rem' }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {GAME_OPTIONS.map(game => {
                  const isSelected = form.games.includes(game.id);
                  const isDisabled = !isSelected && form.games.length >= 2;
                  return (
                    <Button
                      key={game.id} id={`game-${game.id}`} onClick={() => handleGameToggle(game.id)}
                      disabled={isDisabled} fullWidth
                      sx={{
                        justifyContent: 'flex-start', gap: 2, p: 2, borderRadius: 2, textAlign: 'left',
                        border: `1px solid ${isSelected ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        bgcolor: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                        boxShadow: isSelected ? '0 0 20px rgba(0,212,255,0.08)' : 'none',
                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)' },
                        '&.Mui-disabled': { opacity: 0.35 },
                        transition: 'all 0.3s',
                      }}
                    >
                      <Box sx={{
                        width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isSelected ? `linear-gradient(135deg, ${game.color}, ${game.color}88)` : 'rgba(255,255,255,0.05)',
                        boxShadow: isSelected ? `0 4px 12px ${game.color}33` : 'none', flexShrink: 0,
                      }}>
                        <span className="text-xl">{game.icon}</span>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>{game.label}</Typography>
                      <Box sx={{
                        width: 24, height: 24, borderRadius: 1.5, border: `2px solid ${isSelected ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
                        bgcolor: isSelected ? '#00d4ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <CheckCircleIcon sx={{ fontSize: 18, color: '#fff' }} />}
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </Paper>

            {/* Submit */}
            <Button id="ticket-submit" type="submit" variant="contained" color="success" size="large" fullWidth
              startIcon={<CheckCircleIcon />} sx={{ py: 1.8, fontSize: '1.05rem' }}>
              Generate Ticket
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
