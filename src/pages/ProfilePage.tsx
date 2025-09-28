// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { Download, Logout as LogoutIcon } from '@mui/icons-material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getHistory, clearHistory } from '../services/historyService';
import type { HistoryEntry } from '../types';

export default function ProfilePage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем email пользователя
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      // Если нет пользователя — перенаправляем на логин
      navigate('/login');
    }

    // Загружаем историю
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data.slice(0, 10));
      } catch (err) {
        console.error('Ошибка загрузки истории:', err);
        setError('Не удалось загрузить историю');
      }
    };
    loadHistory();
  }, [auth, navigate]);

  const handleExportToExcel = () => {
    const csvContent = [
      ['Дата', 'Действие', 'Клиент ID', 'Детали'],
      ...history.map(h => [
        new Date(h.timestamp).toLocaleString(),
        h.action,
        h.clientId,
        h.details || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = async () => {
    if (window.confirm('Вы уверены, что хотите удалить ВСЕ данные (клиентов и историю)?')) {
      try {
        await clearHistory();
        setHistory([]);
        alert('Все данные успешно удалены!');
      } catch (err) {
        console.error('Ошибка очистки:', err);
        alert('Не удалось очистить данные');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Ошибка выхода:', err);
      alert('Не удалось выйти из аккаунта');
    }
  };

  const stats = history.reduce(
    (acc, entry) => {
      if (entry.action === 'created') acc.created++;
      else if (entry.action === 'updated') acc.updated++;
      else if (entry.action === 'deleted') acc.deleted++;
      return acc;
    },
    { created: 0, updated: 0, deleted: 0 }
  );

  const getActionText = (action: HistoryEntry['action']) => {
    switch (action) {
      case 'created': return 'добавлен';
      case 'updated': return 'обновлён';
      case 'deleted': return 'удалён';
      case 'meeting_completed': return 'встреча состоялась';
      case 'meeting_cancelled': return 'встреча отменена';
      default: return action;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {userEmail || 'Профиль'}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Ваша активность в приложении
      </Typography>

      {/* Кнопки управления */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExportToExcel}
        >
          Экспорт в Excel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleClearAll}
        >
          Очистить все данные
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{ minWidth: '140px' }}
        >
          Выйти
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Статистика */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, justifyContent: 'space-around' }}>
        <Box textAlign="center">
          <Typography variant="h6" color="primary">{stats.created}</Typography>
          <Typography variant="body2">Добавлено</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h6" color="warning">{stats.updated}</Typography>
          <Typography variant="body2">Изменено</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h6" color="error">{stats.deleted}</Typography>
          <Typography variant="body2">Удалено</Typography>
        </Box>
      </Paper>

      {/* Последние действия */}
      <Typography variant="h6" gutterBottom>Последние действия</Typography>
      {history.length > 0 ? (
        <List>
          {history.map((entry) => (
            <React.Fragment key={entry.id || entry.timestamp}>
              <ListItem>
                <ListItemText
                  primary={`${new Date(entry.timestamp).toLocaleString()} — клиент ${getActionText(entry.action)}`}
                  secondary={entry.details}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет записей в истории.
        </Typography>
      )}
    </Box>
  );
}