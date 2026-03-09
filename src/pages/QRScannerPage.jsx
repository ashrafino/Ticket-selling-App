import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyTicket } from '../db';
import Navbar from '../components/Navbar';

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  async function startScanner() {
    setError('');
    setScanResult(null);
    setScanning(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          try {
            await html5QrCode.stop();
          } catch (_) {}
          setScanning(false);
          handleScanResult(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Unable to access camera. Please grant camera permission and try again.');
      setScanning(false);
    }
  }

  function handleScanResult(decodedText) {
    try {
      // Try parsing as JSON (ticket data embedded in QR)
      const data = JSON.parse(decodedText);
      const ticketId = data.id;

      if (!ticketId) {
        setScanResult({ status: 'not_found' });
        return;
      }

      // Verify against local verification store
      const result = verifyTicket(ticketId);

      setScanResult({
        status: result.status,
        ticketId,
        ticket: result.ticket || {
          buyerName: data.name,
          filiere: data.filiere,
          games: data.games,
          phone: data.phone,
          sellerName: data.seller,
        },
      });
    } catch {
      // If not valid JSON, treat as plain ticket ID
      const result = verifyTicket(decodedText);
      if (result.ticket) {
        setScanResult({ status: result.status, ticketId: decodedText, ticket: result.ticket });
      } else {
        setScanResult({ status: 'not_found', ticketId: decodedText });
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try { html5QrCodeRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  function handleScanAgain() {
    setScanResult(null);
    startScanner();
  }

  const statusConfig = {
    valid: {
      icon: '✅',
      title: 'Ticket Valid!',
      subtitle: 'Entry confirmed',
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    already_used: {
      icon: '⚠️',
      title: 'Already Used',
      subtitle: 'This ticket has already been verified',
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    not_found: {
      icon: '❌',
      title: 'Not Found',
      subtitle: 'This QR code is not a valid ticket',
      color: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      textColor: 'text-red-400',
    },
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-display font-bold text-white">
            QR <span className="gradient-text">Scanner</span>
          </h1>
          <p className="text-white/40 mt-1">Scan tickets to verify entry</p>
        </div>

        {/* Scanner Area */}
        {!scanResult && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card neon-border overflow-hidden">
              <div
                id="qr-reader"
                ref={scannerRef}
                className="w-full"
                style={{ minHeight: scanning ? '300px' : '0' }}
              />
              {!scanning && (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-white/50 mb-6">Point your camera at a ticket QR code</p>
                  <button
                    id="start-scan-btn"
                    onClick={startScanner}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Start Scanning
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Scan Result */}
        {scanResult && (
          <div className="animate-slide-up">
            {(() => {
              const config = statusConfig[scanResult.status];
              return (
                <div className={`rounded-2xl border ${config.border} bg-gradient-to-br ${config.color} p-8`}>
                  <div className="text-center mb-6">
                    <span className="text-6xl block mb-4">{config.icon}</span>
                    <h2 className={`text-2xl font-display font-bold ${config.textColor}`}>{config.title}</h2>
                    <p className="text-white/40 text-sm mt-1">{config.subtitle}</p>
                  </div>

                  {scanResult.ticket && (
                    <div className="space-y-3 mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Name</span>
                        <span className="text-white text-sm font-semibold">{scanResult.ticket.buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Filière</span>
                        <span className="text-white text-sm">{scanResult.ticket.filiere}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Activities</span>
                        <span className="text-white text-sm text-right">{scanResult.ticket.games?.join(', ')}</span>
                      </div>
                      {scanResult.ticket.sellerName && (
                        <div className="flex justify-between">
                          <span className="text-white/40 text-sm">Seller</span>
                          <span className="text-white text-sm">{scanResult.ticket.sellerName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {scanResult.ticketId && (
                    <p className="text-white/20 text-xs font-mono text-center mt-4">
                      ID: {scanResult.ticketId.slice(0, 12).toUpperCase()}
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="flex gap-3 mt-6">
              <button
                id="scan-again-btn"
                onClick={handleScanAgain}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Scan Again
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary flex-1"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
