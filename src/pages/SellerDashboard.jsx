import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getTicketsBySeller } from '../db';
import Navbar from '../components/Navbar';
import {
  Box, Container, Typography, Button, Grid, Paper, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function SellerDashboard() {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const tickets = getTicketsBySeller(currentUser.id);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTickets = tickets.filter(t => new Date(t.createdAt) >= todayStart);
    setStats({ today: todayTickets.length, total: tickets.length });
    setRecentTickets(tickets.slice(-5).reverse());
  }, [currentUser]);

  const statCards = [
    { label: "Today's Sales", value: stats.today, icon: <CalendarTodayIcon />, color: 'rgba(0,212,255,0.1)', iconColor: '#00d4ff' },
    { label: 'Total Tickets Sold', value: stats.total, icon: <ConfirmationNumberIcon />, color: 'rgba(168,85,247,0.1)', iconColor: '#a855f7' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }} className="animate-slide-up">
          <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Welcome back, <span className="gradient-text">{userData?.displayName || 'Seller'}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Manage your ticket sales</Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {statCards.map((card, i) => (
            <Grid size={{ xs: 6 }} key={i}>
              <Paper className="animate-slide-up" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 0 15px rgba(0,212,255,0.05)', animationDelay: `${0.1 * (i + 1)}s` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.iconColor }}>
                    {card.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{card.label}</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Create Ticket */}
        <Box sx={{ mb: 4 }} className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button
            component={Link} to="/seller/new-ticket"
            variant="contained" color="primary" size="large"
            startIcon={<AddIcon />}
            sx={{ fontSize: '1.05rem', py: 1.5, px: 3 }}
          >
            Create New Ticket
          </Button>
        </Box>

        {/* Recent Tickets */}
        <Paper className="animate-slide-up" sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.15)', overflow: 'hidden', animationDelay: '0.4s' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>Recent Tickets</Typography>
          </Box>
          {recentTickets.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>🎫</Typography>
              <Typography>No tickets yet. Create your first ticket!</Typography>
            </Box>
          ) : (
            <Box>
              {recentTickets.map(ticket => (
                <Box
                  key={ticket.id}
                  component={Link} to={`/seller/ticket/${ticket.id}`}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 3, py: 2, textDecoration: 'none', color: 'inherit',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                    transition: 'background 0.2s',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#fff' }}>{ticket.buyerName}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {ticket.filiere} · {ticket.games?.join(', ')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={ticket.verified ? '✓ Verified' : 'Active'}
                      size="small"
                      sx={{
                        bgcolor: ticket.verified ? 'rgba(34,197,94,0.1)' : 'rgba(0,212,255,0.1)',
                        color: ticket.verified ? '#22c55e' : '#00d4ff',
                        border: `1px solid ${ticket.verified ? 'rgba(34,197,94,0.2)' : 'rgba(0,212,255,0.2)'}`,
                      }}
                    />
                    <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
