import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, TextField, Button, Alert, Typography, Paper,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/seller');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
    setLoading(false);
  }

  return (
    <Box className="bg-mesh" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      {/* Decorative blurs */}
      <Box sx={{ position: 'absolute', top: 80, left: 80, width: 300, height: 300, bgcolor: 'rgba(168,85,247,0.1)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 80, right: 80, width: 380, height: 380, bgcolor: 'rgba(0,212,255,0.1)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="animate-slide-up">
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: 3,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              mb: 2, boxShadow: '0 8px 25px rgba(168,85,247,0.25)',
            }}>
              <span className="text-2xl">🎮</span>
            </Box>
            <Typography variant="h4" className="gradient-text" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
              GameTix
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
              University Gaming & Chill Event
            </Typography>
          </Box>

          {/* Login Card */}
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 0 15px rgba(0,212,255,0.08)' }}>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 600, mb: 3 }}>
              Welcome back
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  id="login-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  fullWidth required
                />
                <TextField
                  id="login-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  fullWidth required
                />
                <Button
                  id="login-submit"
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? null : <LoginIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
            </form>
          </Paper>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.2)', mt: 4 }}>
            © 2026 GameTix · All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
