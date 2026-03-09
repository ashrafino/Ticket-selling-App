import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container, TextField, Button, Alert, Typography, Paper } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0B0E14', px: 2 }}>
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="animate-slide-up">
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ display: 'inline-block', width: 56, height: 56, borderRadius: 2.5, overflow: 'hidden', mb: 2 }}>
              <img src="/icon.png" alt="GameTix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#E8E8ED', letterSpacing: '-0.02em' }}>
              GameTix
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8B9E', mt: 0.5, fontSize: '0.85rem' }}>
              Event ticketing platform
            </Typography>
          </Box>

          {/* Card */}
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>
              Sign in to your account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField id="login-email" label="Email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="you@example.com" fullWidth required size="small" />
                <TextField id="login-password" label="Password" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Enter password" fullWidth required size="small" />
                <Button id="login-submit" type="submit" variant="contained" color="primary"
                  disabled={loading} startIcon={loading ? null : <LoginIcon />} fullWidth sx={{ mt: 1, py: 1.2 }}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </Box>
            </form>
          </Paper>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#4A4A5A', mt: 4 }}>
            © 2026 GameTix
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
