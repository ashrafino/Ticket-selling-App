import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getTicketsBySeller } from '../db';
import Navbar from '../components/Navbar';
import { Box, Container, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TodayIcon from '@mui/icons-material/Today';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function SellerDashboard() {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const tickets = getTicketsBySeller(currentUser.id);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    setStats({ today: tickets.filter(t => new Date(t.createdAt) >= todayStart).length, total: tickets.length });
    setRecentTickets(tickets.slice(-5).reverse());
  }, [currentUser]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 4 }} className="animate-slide-up">
          <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Welcome back, <span className="accent-text">{userData?.displayName || 'Seller'}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5 }}>Here's your sales overview</Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "Today's sales", value: stats.today, icon: <TodayIcon fontSize="small" />, color: '#7c5cfc' },
            { label: 'Total tickets', value: stats.total, icon: <ConfirmationNumberIcon fontSize="small" />, color: '#e0943a' },
          ].map((card, i) => (
            <Grid size={{ xs: 6 }} key={i}>
              <Paper className="animate-slide-up" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2.5, animationDelay: `${0.05 * (i + 1)}s` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                    {card.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#8B8B9E' }}>{card.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>{card.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Button component={Link} to="/seller/new-ticket" variant="contained" color="primary" startIcon={<AddIcon />}>
            Create New Ticket
          </Button>
        </Box>

        {/* Recent */}
        <Paper sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#E8E8ED' }}>Recent tickets</Typography>
          </Box>
          {recentTickets.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 36, color: '#4A4A5A', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#8B8B9E' }}>No tickets yet</Typography>
            </Box>
          ) : (
            recentTickets.map(ticket => (
              <Box key={ticket.id} component={Link} to={`/seller/ticket/${ticket.id}`}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  px: 2.5, py: 1.8, textDecoration: 'none', color: 'inherit',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, transition: 'background 0.15s',
                }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{ticket.buyerName}</Typography>
                  <Typography variant="caption" sx={{ color: '#8B8B9E' }}>{ticket.filiere} · {ticket.games?.join(', ')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={ticket.verified ? 'Verified' : 'Active'} size="small"
                    sx={{
                      bgcolor: ticket.verified ? 'rgba(62,207,142,0.1)' : 'rgba(124,92,252,0.1)',
                      color: ticket.verified ? '#3ecf8e' : '#7c5cfc',
                      border: `1px solid ${ticket.verified ? 'rgba(62,207,142,0.15)' : 'rgba(124,92,252,0.15)'}`,
                      height: 24,
                    }} />
                  <ChevronRightIcon sx={{ color: '#4A4A5A', fontSize: 18 }} />
                </Box>
              </Box>
            ))
          )}
        </Paper>
      </Container>
    </Box>
  );
}
