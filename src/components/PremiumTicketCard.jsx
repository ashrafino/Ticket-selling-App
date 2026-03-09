import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function PremiumTicketCard({ ticket, ticketId }) {
  const ticketRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  const eventDate = 'March 22, 2026';
  const eventTime = '14:00 — 22:00';
  const eventVenue = 'Golden Pool Academy';
  const eventAddress = '5Q3V+CRP Hay Essaada No 11, Laayoune 70000';
  const eventMapLink = 'https://share.google/uwFxcSIGNIu9O4aKw';

  const qrData = JSON.stringify({
    id: ticketId, name: ticket.buyerName, filiere: ticket.filiere,
    games: ticket.games, phone: ticket.phone, seller: ticket.sellerName,
  });

  async function handleShareWhatsApp() {
    if (!ticketRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#0F1118', scale: 2, useCORS: true, logging: false,
      });
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png', 1.0));
      const fileName = `GameTix_${ticket.buyerName.replace(/\s+/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `GameTix Ticket — ${ticket.buyerName}`,
          text: 'Your event ticket is confirmed!',
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);

        const phone = ticket.phone?.replace(/\s+/g, '').replace(/^\+/, '');
        const message = encodeURIComponent(
          `*GameTix — Ticket Confirmed*\n\n` +
          `Name: ${ticket.buyerName}\n` +
          `Filière: ${ticket.filiere}\n` +
          `Activities: ${ticket.games?.join(', ')}\n` +
          `Date: ${eventDate}\n` +
          `Time: ${eventTime}\n` +
          `Venue: ${eventVenue}\n` +
          `Address: ${eventAddress}\n` +
          `Map: ${eventMapLink}\n\n` +
          `Ticket ID: ${ticketId}\n\n` +
          `Ticket image attached separately.`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share error:', err);
    }
    setSharing(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Ticket Card */}
      <Box ref={ticketRef} className="animate-slide-up"
        sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#0F1118', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1, overflow: 'hidden' }}>
                <img src="/icon.png" alt="GameTix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '-0.01em' }}>GameTix</Typography>
                <Typography variant="caption" sx={{ color: '#8B8B9E', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Event Pass</Typography>
              </Box>
            </Box>
            <Chip label={ticket.verified ? 'Verified' : 'Active'} size="small"
              sx={{
                bgcolor: ticket.verified ? 'rgba(62,207,142,0.1)' : 'rgba(124,92,252,0.1)',
                color: ticket.verified ? '#3ecf8e' : '#7c5cfc',
                border: `1px solid ${ticket.verified ? 'rgba(62,207,142,0.15)' : 'rgba(124,92,252,0.15)'}`,
                fontWeight: 600, fontSize: '0.65rem', height: 22,
              }} />
          </Box>

          {/* Attendee */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>Attendee</Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, mt: 0.3, fontSize: { xs: '1.3rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
              {ticket.buyerName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7c5cfc', fontWeight: 500, fontSize: '0.8rem', mt: 0.3 }}>{ticket.filiere}</Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ position: 'relative', my: 2.5 }}>
            <Box sx={{ position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, bgcolor: '#0B0E14', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', right: -28, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, bgcolor: '#0B0E14', borderRadius: '50%' }} />
            <Box sx={{ borderTop: '1.5px dashed rgba(255,255,255,0.06)', mx: 1 }} />
          </Box>

          {/* Activities */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem', mb: 1, display: 'block' }}>Activities</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {ticket.games?.map((game, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#E8E8ED' }}>{game}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Event Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mt: 0.2 }}>{eventDate}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>Time</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mt: 0.2 }}>{eventTime}</Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: '#8B8B9E', mt: 0.2 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>Venue</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mt: 0.2 }}>{eventVenue}</Typography>
                  <Typography variant="caption" sx={{ color: '#4A4A5A', fontSize: '0.65rem' }}>{eventAddress}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ position: 'relative', my: 2.5 }}>
            <Box sx={{ position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, bgcolor: '#0B0E14', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', right: -28, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, bgcolor: '#0B0E14', borderRadius: '50%' }} />
            <Box sx={{ borderTop: '1.5px dashed rgba(255,255,255,0.06)', mx: 1 }} />
          </Box>

          {/* QR Code */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 2 }}>
              <QRCodeSVG value={qrData} size={140} level="H" includeMargin={false} bgColor="#FFFFFF" fgColor="#0B0E14" />
            </Box>
            <Typography variant="caption" sx={{ color: '#4A4A5A', fontFamily: 'monospace', mt: 1.5, fontSize: '0.6rem', letterSpacing: '0.15em' }}>
              {ticketId?.slice(0, 10).toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Share Button */}
      <Button id="whatsapp-share-btn" onClick={handleShareWhatsApp} disabled={sharing} fullWidth variant="contained"
        startIcon={sharing ? <CircularProgress size={18} color="inherit" /> : <WhatsAppIcon />}
        sx={{
          bgcolor: '#25D366', color: '#fff', py: 1.5, fontSize: '0.9rem',
          '&:hover': { bgcolor: '#1fba59', boxShadow: '0 4px 16px rgba(37,211,102,0.25)' },
          '&.Mui-disabled': { bgcolor: '#25D36680', color: 'rgba(255,255,255,0.7)' },
        }}>
        {sharing ? 'Capturing…' : 'Send via WhatsApp'}
      </Button>
    </Box>
  );
}
