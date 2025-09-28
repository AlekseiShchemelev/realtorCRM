// src/components/Header.tsx
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { CalendarMonth as CalendarMonthIcon, Person as PersonIcon } from '@mui/icons-material';

export default function Header() {

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: { xs: 1.5, sm: 2 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            backgroundColor: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          R
        </Box>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          RealtorCRM
        </Typography>
      </Link>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          component={Link}
          to="/calendar"
          variant="outlined"
          size="small"
          sx={{ minWidth: 'auto', px: 1.5, borderRadius: '12px' }}
        >
          <CalendarMonthIcon fontSize="small" />
        </Button>
        <Button
          component={Link}
          to="/profile"
          variant="contained"
          size="small"
          sx={{
            minWidth: 'auto',
            px: 1.5,
            borderRadius: '12px',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
          }}
        >
          <PersonIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}