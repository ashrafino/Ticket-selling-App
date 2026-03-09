import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, getSellers, createSeller, deleteSeller } from '../db';
import Navbar from '../components/Navbar';
import {
  Box, Container, Typography, Button, Paper, Grid, Chip, TextField, Alert, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaidIcon from '@mui/icons-material/Paid';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupIcon from '@mui/icons-material/Group';

const TICKET_PRICE = 50;

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showCreateSeller, setShowCreateSeller] = useState(false);
  const [sellerForm, setSellerForm] = useState({ email: '', password: '', displayName: '' });
  const [sellerError, setSellerError] = useState('');

  useEffect(() => { refreshData(); }, []);
  function refreshData() { setTickets(getTickets()); setSellers(getSellers()); }

  const totalRevenue = tickets.length * TICKET_PRICE;
  const verifiedCount = tickets.filter(t => t.verified).length;
  const sellerStats = sellers.map(s => {
    const st = tickets.filter(t => t.sellerId === s.id);
    return { ...s, ticketCount: st.length, revenue: st.length * TICKET_PRICE };
  });

  function handleCreateSeller(e) {
    e.preventDefault(); setSellerError('');
    try {
      createSeller(sellerForm);
      setSellerForm({ email: '', password: '', displayName: '' });
      setShowCreateSeller(false); refreshData();
    } catch (err) { setSellerError(err.message); }
  }

  function handleDeleteSeller(id) {
    if (!window.confirm('Remove this seller?')) return;
    deleteSeller(id); refreshData();
  }

  const stats = [
    { label: 'Tickets sold', value: tickets.length, icon: <ConfirmationNumberIcon fontSize="small" />, color: '#7c5cfc' },
    { label: 'Revenue', value: `${totalRevenue} MAD`, icon: <PaidIcon fontSize="small" />, color: '#3ecf8e' },
    { label: 'Verified', value: `${verifiedCount}/${tickets.length}`, icon: <VerifiedIcon fontSize="small" />, color: '#e0943a' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }} className="animate-slide-up">
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Dashboard</Typography>
            <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5 }}>Overview of all sales and sellers</Typography>
          </Box>
          <Button component={Link} to="/admin/scanner" id="open-scanner-btn"
            variant="contained" color="primary" startIcon={<QrCodeScannerIcon />} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
            QR Scanner
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((s, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Paper className="animate-slide-up" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2.5, animationDelay: `${0.05 * (i + 1)}s` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#8B8B9E' }}>{s.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>{s.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Sellers */}
        <Paper className="animate-slide-up" sx={{ borderRadius: 2.5, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>Sellers</Typography>
            <Button id="create-seller-btn" variant="contained" color="primary" size="small" startIcon={<AddIcon />}
              onClick={() => setShowCreateSeller(!showCreateSeller)} sx={{ fontSize: '0.75rem', px: 1.5, py: 0.6 }}>Add</Button>
          </Box>

          {showCreateSeller && (
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.04)', bgcolor: 'rgba(255,255,255,0.01)' }} className="animate-fade-in">
              <form onSubmit={handleCreateSeller}>
                {sellerError && <Alert severity="error" sx={{ mb: 2 }}>{sellerError}</Alert>}
                <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField id="seller-name-input" label="Name" value={sellerForm.displayName} onChange={e => setSellerForm(p => ({ ...p, displayName: e.target.value }))} fullWidth required size="small" /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField id="seller-email-input" label="Email" type="email" value={sellerForm.email} onChange={e => setSellerForm(p => ({ ...p, email: e.target.value }))} fullWidth required size="small" /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField id="seller-password-input" label="Password" type="password" value={sellerForm.password} onChange={e => setSellerForm(p => ({ ...p, password: e.target.value }))} fullWidth required size="small" /></Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button type="submit" variant="contained" color="success" size="small" sx={{ fontSize: '0.75rem' }}>Create</Button>
                  <Button onClick={() => setShowCreateSeller(false)} size="small" sx={{ color: '#8B8B9E', fontSize: '0.75rem' }}>Cancel</Button>
                </Box>
              </form>
            </Box>
          )}

          {sellers.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 32, color: '#4A4A5A', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#8B8B9E' }}>No sellers yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                    <TableCell align="center">Tickets</TableCell>
                    <TableCell align="center">Revenue</TableCell>
                    <TableCell align="right" sx={{ width: 48 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellerStats.map(s => (
                    <TableRow key={s.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>{s.displayName}</Typography>
                        <Typography variant="caption" sx={{ color: '#8B8B9E', display: { xs: 'block', sm: 'none' }, fontSize: '0.65rem' }}>{s.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: '#8B8B9E', fontSize: '0.8rem' }}>{s.email}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{s.ticketCount}</TableCell>
                      <TableCell align="center" sx={{ color: '#3ecf8e', fontWeight: 600, fontSize: '0.8rem' }}>{s.revenue} MAD</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteSeller(s.id)} size="small" sx={{ color: '#4A4A5A', '&:hover': { color: '#f75555' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* All Tickets */}
        <Paper className="animate-slide-up" sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>All tickets</Typography>
          </Box>
          {tickets.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 32, color: '#4A4A5A', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#8B8B9E' }}>No tickets yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Buyer</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Filière</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Activities</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Seller</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map(t => (
                    <TableRow key={t.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>{t.buyerName}</Typography>
                        <Typography variant="caption" sx={{ color: '#8B8B9E', fontSize: '0.65rem' }}>{t.phone}</Typography>
                        <Typography variant="caption" sx={{ color: '#8B8B9E', display: { xs: 'block', md: 'none' }, fontSize: '0.65rem' }}>{t.filiere}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: '#8B8B9E', fontSize: '0.8rem' }}>{t.filiere}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: '#8B8B9E', maxWidth: 180 }}>
                        <Typography variant="body2" noWrap sx={{ fontSize: '0.78rem' }}>{t.games?.join(', ')}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: '#8B8B9E', fontSize: '0.8rem' }}>{t.sellerName}</TableCell>
                      <TableCell align="center">
                        <Chip label={t.verified ? 'Verified' : 'Active'} size="small"
                          sx={{
                            bgcolor: t.verified ? 'rgba(62,207,142,0.1)' : 'rgba(124,92,252,0.1)',
                            color: t.verified ? '#3ecf8e' : '#7c5cfc',
                            border: `1px solid ${t.verified ? 'rgba(62,207,142,0.12)' : 'rgba(124,92,252,0.12)'}`,
                            height: 22, fontSize: '0.7rem',
                          }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
