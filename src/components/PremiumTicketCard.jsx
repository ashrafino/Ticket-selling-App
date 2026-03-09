import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

export default function PremiumTicketCard({ ticket, ticketId }) {
  const ticketRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  const eventDate = 'March 22, 2026';
  const eventTime = '14:00 — 22:00';
  const eventVenue = 'Golden Pool Academy';
  const eventAddress = '5Q3V+CRP Hay Essaada No 11, Laayoune 70000';
  const eventMapLink = 'https://share.google/uwFxcSIGNIu9O4aKw';

  const gameIcons = {
    'Tournois PS5 FC 26': '🎮',
    'Billard': '🎱',
    "L'Espace Chill — Uno / Jeux de Société / Mafia": '🃏',
  };

  // Encode ticket data in QR code so scanning works without a shared database
  const qrData = JSON.stringify({
    id: ticketId,
    name: ticket.buyerName,
    filiere: ticket.filiere,
    games: ticket.games,
    phone: ticket.phone,
    seller: ticket.sellerName,
  });

  async function handleShareWhatsApp() {
    if (!ticketRef.current) return;
    setSharing(true);

    try {
      // Capture the ticket card as a canvas
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2, // High-res output
        useCORS: true,
        logging: false,
      });

      // Convert canvas to a Blob
      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/png', 1.0)
      );

      const fileName = `GameTix_${ticket.buyerName.replace(/\s+/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Try Web Share API (works on mobile — opens WhatsApp directly)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `🎮 GameTix Ticket — ${ticket.buyerName}`,
          text: `Your ticket for the Gaming & Chill event is confirmed! 🎫`,
          files: [file],
        });
      } else {
        // Fallback: download the PNG so user can attach manually in WhatsApp
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Also open WhatsApp with a text message
        const phone = ticket.phone?.replace(/\s+/g, '').replace(/^\+/, '');
        const message = encodeURIComponent(
          `🎮 *GameTix — Your Ticket is Confirmed!*\n\n` +
          `👤 Name: ${ticket.buyerName}\n` +
          `🎓 Filière: ${ticket.filiere}\n` +
          `🕹️ Activities: ${ticket.games?.join(', ')}\n` +
          `📅 Date: ${eventDate}\n` +
          `🕐 Time: ${eventTime}\n` +
          `📍 Venue: ${eventVenue}\n` +
          `📌 Address: ${eventAddress}\n` +
          `🗺️ Map: ${eventMapLink}\n\n` +
          `🎫 Ticket ID: ${ticketId}\n\n` +
          `📎 Ticket image downloaded — attach it to this chat!\n\n` +
          `See you there! 🔥`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      }
    } catch (err) {
      // User cancelled share sheet or error
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
      }
    }
    setSharing(false);
  }

  return (
    <div className="space-y-6">
      {/* Ticket Card */}
      <div ref={ticketRef} className="relative overflow-hidden animate-slide-up">
        {/* Main ticket body */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.12),transparent_50%)]" />

          {/* Animated shimmer border */}
          <div className="absolute inset-0 rounded-2xl border border-white/10" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-30" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, black 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, black 100%)' }} />

          <div className="relative z-10 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-purple/30">
                    <span className="text-sm">🎮</span>
                  </div>
                  <span className="text-lg font-display font-bold gradient-text">GameTix</span>
                </div>
                <p className="text-white/30 text-xs tracking-widest uppercase mt-1">University Gaming & Chill</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                ticket.verified
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30 animate-glow-pulse'
              }`}>
                {ticket.verified ? '✓ VERIFIED' : '● ACTIVE'}
              </div>
            </div>

            {/* Buyer Name — Hero */}
            <div className="mb-6">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Attendee</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-shadow-glow">
                {ticket.buyerName}
              </h2>
              <p className="text-neon-blue/80 font-medium mt-1">{ticket.filiere}</p>
            </div>

            {/* Perforated Divider */}
            <div className="relative my-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-dark-900 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-dark-900 rounded-full" />
              <div className="border-t-2 border-dashed border-white/10 mx-4" />
            </div>

            {/* Games Section */}
            <div className="mb-6">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Activities</p>
              <div className="space-y-2">
                {ticket.games?.map((game, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <span className="text-xl">{gameIcons[game] || '🎯'}</span>
                    <span className="text-white/80 text-sm font-medium">{game}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Date</p>
                <p className="text-white text-sm font-semibold">{eventDate}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Time</p>
                <p className="text-white text-sm font-semibold">{eventTime}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Venue</p>
                <p className="text-white text-sm font-semibold">{eventVenue}</p>
                <p className="text-white/40 text-xs mt-0.5">{eventAddress}</p>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative my-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-dark-900 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-dark-900 rounded-full" />
              <div className="border-t-2 border-dashed border-white/10 mx-4" />
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                <QRCodeSVG
                  value={qrData}
                  size={160}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#0a0a1a"
                />
              </div>
              <p className="text-white/20 text-xs font-mono mt-3 tracking-wider">
                ID: {ticketId?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <button
          id="whatsapp-share-btn"
          onClick={handleShareWhatsApp}
          disabled={sharing}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-emerald-600 to-emerald-500
                     hover:from-emerald-500 hover:to-emerald-400
                     transition-all duration-300 transform hover:scale-[1.02]
                     shadow-lg hover:shadow-emerald-500/25 active:scale-95 text-lg
                     disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
        >
          {sharing ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Capturing ticket...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Ticket via WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  );
}
