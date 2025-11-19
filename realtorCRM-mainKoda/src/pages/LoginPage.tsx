// src/pages/LoginPage.tsx
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // ← получаем auth внутри компонента
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const auth = getAuth(); // ← правильно: получаем auth при каждом рендере

  // Проверяем, не авторизован ли уже пользователь
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(from, { replace: true });
      }
    });
    return () => unsubscribe();
  }, [auth, from, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Перенаправление произойдёт через onAuthStateChanged
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError('Не удалось войти. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Вход в RealtorCRM
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handleGoogleLogin}
          fullWidth
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти через Google'}
        </Button>
      </Paper>
    </Box>
  );
}