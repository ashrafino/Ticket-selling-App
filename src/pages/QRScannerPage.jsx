import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTicket } from '../db';
import Navbar from '../components/Navbar';
import { Box, Container, Typography, Button, Paper, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';

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
        }, () => {}
      );
    } catch {
      setError('Camera access denied. Please allow camera permissions.');
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
      setScanResult(result.ticket ? { status: result.status, ticketId: decodedText, ticket: result.ticket } : { status: 'not_found', ticketId: decodedText });
    }
  }

  useEffect(() => () => { if (html5QrCodeRef.current) try { html5QrCodeRef.current.stop(); } catch (_) {} }, []);

  const statusConfig = {
    valid: { icon: <CheckCircleIcon sx={{ fontSize: 48, color: '#3ecf8e' }} />, title: 'Valid ticket', subtitle: 'Entry confirmed', bg: 'rgba(62,207,142,0.06)', border: 'rgba(62,207,142,0.15)' },
    already_used: { icon: <WarningAmberIcon sx={{ fontSize: 48, color: '#e8a838' }} />, title: 'Already scanned', subtitle: 'This ticket was already verified', bg: 'rgba(232,168,56,0.06)', border: 'rgba(232,168,56,0.15)' },
    not_found: { icon: <CancelIcon sx={{ fontSize: 48, color: '#f75555' }} />, title: 'Invalid', subtitle: 'This is not a valid ticket', bg: 'rgba(247,85,85,0.06)', border: 'rgba(247,85,85,0.15)' },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0E14' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 3 }} className="animate-slide-up">
          <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => navigate('/admin')}
            sx={{ color: '#8B8B9E', mb: 2, '&:hover': { color: '#E8E8ED' } }}>Back</Button>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            QR Scanner
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5 }}>Scan tickets to verify entry</Typography>
        </Box>

        {!scanResult && (
          <Box className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <Paper sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
              <div id="qr-reader" ref={scannerRef} style={{ width: '100%', minHeight: scanning ? 300 : 0 }} />
              {!scanning && (
                <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
                  <CameraAltIcon sx={{ fontSize: 40, color: '#4A4A5A', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#8B8B9E', mb: 3 }}>Point your camera at a ticket QR code</Typography>
                  <Button id="start-scan-btn" variant="contained" color="primary" startIcon={<CameraAltIcon />} onClick={startScanner}>
                    Start scanning
                  </Button>
                </Box>
              )}
            </Paper>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        )}

        {scanResult && (
          <Box className="animate-slide-up">
            {(() => {
              const cfg = statusConfig[scanResult.status];
              return (
                <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2.5, bgcolor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    {cfg.icon}
                    <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, mt: 1.5 }}>{cfg.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5, fontSize: '0.8rem' }}>{cfg.subtitle}</Typography>
                  </Box>
                  {scanResult.ticket && (
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {[
                        ['Name', scanResult.ticket.buyerName],
                        ['Filière', scanResult.ticket.filiere],
                        ['Activities', scanResult.ticket.games?.join(', ')],
                        scanResult.ticket.sellerName && ['Seller', scanResult.ticket.sellerName],
                      ].filter(Boolean).map(([label, val]) => (
                        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
                          <Typography variant="caption" sx={{ color: '#8B8B9E' }}>{label}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right' }}>{val}</Typography>
                        </Box>
                      ))}
                    </Paper>
                  )}
                  {scanResult.ticketId && (
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#4A4A5A', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {scanResult.ticketId.slice(0, 12).toUpperCase()}
                    </Typography>
                  )}
                </Paper>
              );
            })()}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <Button id="scan-again-btn" variant="contained" color="primary" fullWidth startIcon={<ReplayIcon />}
                onClick={() => { setScanResult(null); startScanner(); }}>Scan again</Button>
              <Button variant="outlined" fullWidth startIcon={<DashboardIcon />} onClick={() => navigate('/admin')}
                sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8B8B9E' }}>Dashboard</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
