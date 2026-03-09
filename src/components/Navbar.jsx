import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const { userRole, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const isAdmin = userRole === 'admin';
  const basePath = isAdmin ? '/admin' : '/seller';

  const adminLinks = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Scanner', path: '/admin/scanner', icon: <QrCodeScannerIcon fontSize="small" /> },
  ];

  const initials = (userData?.displayName || '?')[0].toUpperCase();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, sm: 3 }, minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && isAdmin && (
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Link to={basePath} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, overflow: 'hidden', flexShrink: 0 }}>
              <img src="/icon.png" alt="GameTix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="h6" sx={{
              display: { xs: 'none', sm: 'block' }, fontFamily: 'Outfit',
              fontWeight: 700, fontSize: '1rem', color: '#E8E8ED', letterSpacing: '-0.01em',
            }}>
              GameTix
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          {isAdmin && !isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
              {adminLinks.map(link => (
                <Button
                  key={link.path} component={Link} to={link.path}
                  startIcon={link.icon} size="small"
                  sx={{
                    color: location.pathname === link.path ? '#E8E8ED' : '#8B8B9E',
                    bgcolor: location.pathname === link.path ? 'rgba(255,255,255,0.06)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    borderRadius: 2, px: 1.5, fontSize: '0.8rem',
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(124,92,252,0.2)', color: '#7c5cfc', fontSize: '0.75rem', fontWeight: 600 }}>
                {initials}
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: '#E8E8ED', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                  {userData?.displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8B8B9E', fontSize: '0.65rem', textTransform: 'capitalize' }}>
                  {userRole}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleLogout} id="logout-btn" size="small"
              sx={{ color: '#8B8B9E', '&:hover': { color: '#E8E8ED', bgcolor: 'rgba(255,255,255,0.06)' } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: '#12151E', width: 240, borderRight: '1px solid rgba(255,255,255,0.06)' } }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: 1, overflow: 'hidden' }}>
            <img src="/icon.png" alt="GameTix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Typography variant="body2" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#E8E8ED' }}>GameTix</Typography>
        </Box>
        <List sx={{ p: 1 }}>
          {adminLinks.map(link => (
            <ListItem key={link.path} component={Link} to={link.path} onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: 2, mb: 0.5,
                bgcolor: location.pathname === link.path ? 'rgba(124,92,252,0.1)' : 'transparent',
                color: location.pathname === link.path ? '#7c5cfc' : '#8B8B9E',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
              }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
