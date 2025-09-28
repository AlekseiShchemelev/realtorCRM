import { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Download, Delete as DeleteIcon } from '@mui/icons-material';
import type { HistoryEntry } from '../types';
import { getHistory, clearHistory } from '../services/historyService';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

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
    if (window.confirm('Вы уверены, что хотите очистить всю историю?')) {
      await clearHistory();
      setHistory([]);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>История действий</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Здесь отображаются все изменения в списке клиентов.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
          startIcon={<DeleteIcon />}
          onClick={handleClearAll}
        >
          Очистить все данные
        </Button>
      </Box>

      {history.length > 0 ? (
        <Box>
          {history.map(entry => (
            <Box key={entry.id!} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="body2">
                {new Date(entry.timestamp).toLocaleString()} — {entry.action} (ID клиента: {entry.clientId})
              </Typography>
              {entry.details && <Typography variant="caption" color="text.secondary">{entry.details}</Typography>}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          История действий пока пуста.
        </Typography>
      )}
    </Box>
  );
}