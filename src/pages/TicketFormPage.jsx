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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

const GAME_OPTIONS = [
  { id: 'ps5_fc26', label: 'Tournois PS5 FC 26', color: '#3b82f6' },
  { id: 'billard', label: 'Billard', color: '#22c55e' },
  { id: 'espace_chill', label: "L'Espace Chill — Uno / Jeux de Société / Mafia", color: '#a855f7' },
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
    if (form.games.length === 0) return setError('Select at least one activity.');

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => navigate('/seller')}
            sx={{ color: '#8B8B9E', mb: 2, '&:hover': { color: '#E8E8ED' } }}>Back</Button>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            New ticket
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5 }}>Register a new buyer</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2.5 }}>
              <TextField id="ticket-name" label="Full Name" value={form.buyerName}
                onChange={e => setForm(p => ({ ...p, buyerName: e.target.value }))}
                placeholder="Buyer's full name" fullWidth required size="small" />
            </Paper>

            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2.5 }}>
              <FormControl fullWidth required size="small">
                <InputLabel id="filiere-label" sx={{ color: '#8B8B9E', '&.Mui-focused': { color: '#7c5cfc' } }}>Filière</InputLabel>
                <Select id="ticket-filiere" labelId="filiere-label" label="Filière"
                  value={form.filiere} onChange={e => setForm(p => ({ ...p, filiere: e.target.value }))}
                  sx={{ borderRadius: 2.5, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c5cfc' } }}>
                  {FILIERE_OPTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
            </Paper>

            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2.5 }}>
              <TextField id="ticket-phone" label="Phone Number" type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+212 6XX XX XX XX" fullWidth required size="small" />
            </Paper>

            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#8B8B9E', fontWeight: 500, fontSize: '0.8rem' }}>Activities</Typography>
                <Chip label={`${form.games.length}/2`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)', color: '#8B8B9E', fontSize: '0.7rem', height: 22 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {GAME_OPTIONS.map(game => {
                  const isSelected = form.games.includes(game.id);
                  const isDisabled = !isSelected && form.games.length >= 2;
                  return (
                    <Button key={game.id} id={`game-${game.id}`} onClick={() => handleGameToggle(game.id)} disabled={isDisabled} fullWidth
                      sx={{
                        justifyContent: 'space-between', p: 1.5, borderRadius: 2, textAlign: 'left',
                        border: `1px solid ${isSelected ? `${game.color}40` : 'rgba(255,255,255,0.06)'}`,
                        bgcolor: isSelected ? `${game.color}0a` : 'transparent',
                        color: isSelected ? '#E8E8ED' : '#8B8B9E',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                        '&.Mui-disabled': { opacity: 0.3 }, transition: 'all 0.2s',
                      }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>{game.label}</Typography>
                      <Box sx={{
                        width: 20, height: 20, borderRadius: 1, border: `1.5px solid ${isSelected ? game.color : 'rgba(255,255,255,0.15)'}`,
                        bgcolor: isSelected ? game.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, ml: 1,
                      }}>
                        {isSelected && <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />}
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </Paper>

            <Button id="ticket-submit" type="submit" variant="contained" color="success" fullWidth
              startIcon={<CheckCircleOutlineIcon />} sx={{ py: 1.3 }}>
              Generate Ticket
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
