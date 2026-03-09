import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const { currentUser, userRole, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  const isAdmin = userRole === 'admin';
  const basePath = isAdmin ? '/admin' : '/seller';

  const adminLinks = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Scanner', path: '/admin/scanner', icon: <QrCodeScannerIcon /> },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, sm: 3 } }}>
          {isMobile && isAdmin && (
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Link to={basePath} className="flex items-center gap-2 no-underline group">
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(168,85,247,0.2)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 4px 20px rgba(168,85,247,0.4)' },
            }}>
              <span className="text-lg">🎮</span>
            </Box>
            <Typography variant="h6" className="gradient-text" sx={{ display: { xs: 'none', sm: 'block' }, fontFamily: 'Outfit', fontWeight: 700 }}>
              GameTix
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          {isAdmin && !isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
              {adminLinks.map(link => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  startIcon={link.icon}
                  size="small"
                  sx={{
                    color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.5)',
                    bgcolor: location.pathname === link.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                    borderRadius: 2, px: 2,
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, lineHeight: 1.2 }}>
                {userData?.displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                {userRole}
              </Typography>
            </Box>
            <IconButton onClick={handleLogout} id="logout-btn" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer for admin */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: '#0f0f2e', width: 260, borderRight: '1px solid rgba(255,255,255,0.05)' } }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" className="gradient-text" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
            🎮 GameTix
          </Typography>
        </Box>
        <List>
          {adminLinks.map(link => (
            <ListItem
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: 2, mx: 1, mb: 0.5, width: 'auto',
                bgcolor: location.pathname === link.path ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: location.pathname === link.path ? '#a855f7' : 'rgba(255,255,255,0.6)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
