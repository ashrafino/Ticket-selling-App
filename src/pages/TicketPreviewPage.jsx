import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById } from '../db';
import Navbar from '../components/Navbar';
import PremiumTicketCard from '../components/PremiumTicketCard';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function TicketPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => { setTicket(getTicketById(id)); }, [id]);

  if (!ticket) {
    return (
      <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
          <Paper sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>❌</Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, mb: 1 }}>Ticket Not Found</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>This ticket doesn't exist or has been removed.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/seller')}>Back to Dashboard</Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/seller')}
            sx={{ color: 'text.secondary', mb: 2, '&:hover': { color: '#fff' } }}>
            Back to Dashboard
          </Button>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
            Ticket <span className="gradient-text">Preview</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Share this ticket with the buyer</Typography>
        </Box>

        <PremiumTicketCard ticket={ticket} ticketId={id} />

        <Box sx={{ mt: 3, textAlign: 'center' }} className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button id="create-another-btn" variant="outlined" startIcon={<AddIcon />}
            onClick={() => navigate('/seller/new-ticket')}
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: 'rgba(255,255,255,0.3)', color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Create Another Ticket
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
