import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById } from '../db';
import Navbar from '../components/Navbar';
import PremiumTicketCard from '../components/PremiumTicketCard';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default function TicketPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => { setTicket(getTicketById(id)); }, [id]);

  if (!ticket) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
          <Paper sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
            <ConfirmationNumberIcon sx={{ fontSize: 40, color: '#4A4A5A', mb: 2 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600, mb: 1 }}>Ticket not found</Typography>
            <Typography variant="body2" sx={{ color: '#8B8B9E', mb: 3 }}>This ticket doesn't exist or was removed.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/seller')}>Back to Dashboard</Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => navigate('/seller')}
            sx={{ color: '#8B8B9E', mb: 2, '&:hover': { color: '#E8E8ED' } }}>Back</Button>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Ticket preview
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5 }}>Share this with the buyer</Typography>
        </Box>

        <PremiumTicketCard ticket={ticket} ticketId={id} />

        <Box sx={{ mt: 3, textAlign: 'center' }} className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button id="create-another-btn" variant="outlined" startIcon={<AddIcon />} size="small"
            onClick={() => navigate('/seller/new-ticket')}
            sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8B8B9E', '&:hover': { borderColor: 'rgba(255,255,255,0.2)', color: '#E8E8ED' } }}>
            Create another
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
