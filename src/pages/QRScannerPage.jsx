import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTicket } from '../db';
import Navbar from '../components/Navbar';
import { Box, Container, Typography, Button, Paper, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  async function startScanner() {
    setError(''); setScanResult(null); setScanning(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        async (decodedText) => {
          try { await html5QrCode.stop(); } catch (_) {}
          setScanning(false); handleScanResult(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setError('Unable to access camera. Please grant camera permission.');
      setScanning(false);
    }
  }

  function handleScanResult(decodedText) {
    try {
      const data = JSON.parse(decodedText);
      if (!data.id) { setScanResult({ status: 'not_found' }); return; }
      const result = verifyTicket(data.id);
      setScanResult({
        status: result.status, ticketId: data.id,
        ticket: result.ticket || { buyerName: data.name, filiere: data.filiere, games: data.games, phone: data.phone, sellerName: data.seller },
      });
    } catch {
      const result = verifyTicket(decodedText);
      setScanResult(result.ticket
        ? { status: result.status, ticketId: decodedText, ticket: result.ticket }
        : { status: 'not_found', ticketId: decodedText });
    }
  }

  useEffect(() => () => { if (html5QrCodeRef.current) try { html5QrCodeRef.current.stop(); } catch (_) {} }, []);

  const statusConfig = {
    valid: { icon: '✅', title: 'Ticket Valid!', subtitle: 'Entry confirmed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
    already_used: { icon: '⚠️', title: 'Already Used', subtitle: 'This ticket was already verified', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    not_found: { icon: '❌', title: 'Not Found', subtitle: 'Not a valid ticket QR code', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  };

  return (
    <Box sx={{ minHeight: '100vh' }} className="bg-mesh">
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')}
            sx={{ color: 'text.secondary', mb: 2, '&:hover': { color: '#fff' } }}>Back to Dashboard</Button>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            QR <span className="gradient-text">Scanner</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Scan tickets to verify entry</Typography>
        </Box>

        {!scanResult && (
          <Box className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Paper sx={{ borderRadius: 3, border: '1px solid rgba(0,212,255,0.12)', overflow: 'hidden' }}>
              <div id="qr-reader" ref={scannerRef} style={{ width: '100%', minHeight: scanning ? 300 : 0 }} />
              {!scanning && (
                <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
                  <Box sx={{
                    width: 72, height: 72, mx: 'auto', mb: 3, borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CameraAltIcon sx={{ fontSize: 36, color: '#00d4ff' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Point your camera at a ticket QR code</Typography>
                  <Button id="start-scan-btn" variant="contained" color="primary" startIcon={<CameraAltIcon />} onClick={startScanner}>
                    Start Scanning
                  </Button>
                </Box>
              )}
            </Paper>
            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
          </Box>
        )}

        {scanResult && (
          <Box className="animate-slide-up">
            {(() => {
              const cfg = statusConfig[scanResult.status];
              return (
                <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, bgcolor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography sx={{ fontSize: '3.5rem', mb: 1 }}>{cfg.icon}</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: cfg.color }}>{cfg.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{cfg.subtitle}</Typography>
                  </Box>
                  {scanResult.ticket && (
                    <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {[
                        ['Name', scanResult.ticket.buyerName],
                        ['Filière', scanResult.ticket.filiere],
                        ['Activities', scanResult.ticket.games?.join(', ')],
                        scanResult.ticket.sellerName && ['Seller', scanResult.ticket.sellerName],
                      ].filter(Boolean).map(([label, val]) => (
                        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>{val}</Typography>
                        </Box>
                      ))}
                    </Paper>
                  )}
                  {scanResult.ticketId && (
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.disabled', fontFamily: 'monospace' }}>
                      ID: {scanResult.ticketId.slice(0, 12).toUpperCase()}
                    </Typography>
                  )}
                </Paper>
              );
            })()}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <Button id="scan-again-btn" variant="contained" color="primary" fullWidth
                startIcon={<ReplayIcon />} onClick={() => { setScanResult(null); startScanner() }}>Scan Again</Button>
              <Button variant="outlined" fullWidth startIcon={<DashboardIcon />} onClick={() => navigate('/admin')}
                sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary' }}>Dashboard</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
