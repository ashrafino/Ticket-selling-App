import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, getSellers, createSeller, deleteSeller } from '../db';
import Navbar from '../components/Navbar';
import {
  Box, Container, Typography, Button, Paper, Grid, Chip, TextField, Alert, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaidIcon from '@mui/icons-material/Paid';
import VerifiedIcon from '@mui/icons-material/Verified';

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
    { label: 'Total Tickets', value: tickets.length, icon: <ConfirmationNumberIcon />, color: '#00d4ff' },
    { label: 'Total Revenue', value: `${totalRevenue} MAD`, icon: <PaidIcon />, color: '#22c55e' },
    { label: 'Verified', value: `${verifiedCount} / ${tickets.length}`, icon: <VerifiedIcon />, color: '#a855f7' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }} className="animate-slide-up">
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Admin <span className="gradient-text">Dashboard</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Overview of all sales</Typography>
          </Box>
          <Button component={Link} to="/admin/scanner" id="open-scanner-btn"
            variant="contained" color="primary" startIcon={<QrCodeScannerIcon />}>
            QR Scanner
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((s, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Paper className="animate-slide-up" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)', animationDelay: `${0.1 * (i + 1)}s` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.4rem', sm: '2rem' } }}>{s.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Sellers */}
        <Paper className="animate-slide-up" sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)', overflow: 'hidden', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>Sellers</Typography>
            <Button id="create-seller-btn" variant="contained" color="primary" size="small" startIcon={<AddIcon />}
              onClick={() => setShowCreateSeller(!showCreateSeller)}>Add Seller</Button>
          </Box>

          {showCreateSeller && (
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.01)' }} className="animate-fade-in">
              <form onSubmit={handleCreateSeller}>
                {sellerError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{sellerError}</Alert>}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField id="seller-name-input" label="Display Name" value={sellerForm.displayName}
                      onChange={e => setSellerForm(p => ({ ...p, displayName: e.target.value }))} fullWidth required size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField id="seller-email-input" label="Email" type="email" value={sellerForm.email}
                      onChange={e => setSellerForm(p => ({ ...p, email: e.target.value }))} fullWidth required size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField id="seller-password-input" label="Password" type="password" value={sellerForm.password}
                      onChange={e => setSellerForm(p => ({ ...p, password: e.target.value }))} fullWidth required size="small" />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button type="submit" variant="contained" color="success" size="small">Create Seller</Button>
                  <Button onClick={() => setShowCreateSeller(false)} variant="outlined" size="small"
                    sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary' }}>Cancel</Button>
                </Box>
              </form>
            </Box>
          )}

          {sellers.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>👥</Typography>
              <Typography>No sellers yet. Create one above!</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                    <TableCell align="center">Tickets</TableCell>
                    <TableCell align="center">Revenue</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellerStats.map(s => (
                    <TableRow key={s.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.displayName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'block', sm: 'none' } }}>{s.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>{s.email}</TableCell>
                      <TableCell align="center">{s.ticketCount}</TableCell>
                      <TableCell align="center" sx={{ color: '#22c55e', fontWeight: 600 }}>{s.revenue} MAD</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteSeller(s.id)} size="small" sx={{ color: 'rgba(239,68,68,0.5)', '&:hover': { color: '#ef4444' } }}>
                          <DeleteIcon fontSize="small" />
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
        <Paper className="animate-slide-up" sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)', overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>All Tickets</Typography>
          </Box>
          {tickets.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>🎫</Typography>
              <Typography>No tickets created yet.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
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
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.buyerName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.phone}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'block', md: 'none' } }}>{t.filiere}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary' }}>{t.filiere}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary', maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>{t.games?.join(', ')}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary' }}>{t.sellerName}</TableCell>
                      <TableCell align="center">
                        <Chip label={t.verified ? '✓ Verified' : 'Active'} size="small"
                          sx={{
                            bgcolor: t.verified ? 'rgba(34,197,94,0.1)' : 'rgba(0,212,255,0.1)',
                            color: t.verified ? '#22c55e' : '#00d4ff',
                            border: `1px solid ${t.verified ? 'rgba(34,197,94,0.2)' : 'rgba(0,212,255,0.2)'}`,
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
