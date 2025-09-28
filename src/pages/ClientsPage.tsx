// src/pages/ClientsPage.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import ClientCard from '../components/ClientCard';
import type { Client } from '../types';
import { getClients, updateClient, deleteClient } from '../services/clientService';
import AddClientForm from '../components/AddClientForm';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setEditingClient(null);
    setSearchTerm('');
    loadClients();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddFormOpen(true);
  };

  const handleUpdateClient = async (id: string, updatedData: Partial<Client>) => {
    await updateClient(id, updatedData);
    loadClients();
  };

  const handleDeleteClient = async (id: string, fullName: string) => {
    if (window.confirm(`Удалить клиента "${fullName}"?`)) {
      await deleteClient(id);
      loadClients();
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Клиенты
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Управляйте списком ваших клиентов и встреч.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Поиск по ФИО, телефону или адресу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            sx: { borderRadius: '12px' },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddClient}
          sx={{
            minWidth: { xs: 'auto', sm: 120 },
            height: 40,
            borderRadius: '12px',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
          }}
        >
          <AddIcon sx={{ mr: { xs: 0, sm: 1 } }} />
          <span style={{ display: 'none' }} className="sm:inline"> Добавить </span>
        </Button>
      </Box>

      {filteredClients.length > 0 ? (
        filteredClients.map((client) => (
          <ClientCard
            key={client.id!}
            client={client}
            onEdit={() => handleEditClient(client)}
            onDelete={() => handleDeleteClient(client.id!, client.fullName)}
            onMarkCompleted={() => handleUpdateClient(client.id!, { status: 'completed' })}
            onMarkCancelled={() => handleUpdateClient(client.id!, { status: 'cancelled' })}
            onShowOnMap={() => {
              const address = client.address.trim();
              if (address) {
                const encoded = encodeURIComponent(address);
                window.open(`https://yandex.ru/maps/?text=${encoded}`, '_blank');
              } else {
                alert('Адрес не указан');
              }
            }}
            onShowRoute={() => {
              const address = client.address.trim();
              if (address) {
                const encoded = encodeURIComponent(address);
                const naviUrl = `yandexnavi://build_route_on_map?&lat=0&lon=0&to=${encoded}`;
                const mapsUrl = `https://yandex.ru/maps/?rtext=~${encoded}&rtt=auto`;
                const win = window.open(naviUrl, '_blank');
                if (!win || win.closed || win.outerHeight === 0) {
                  window.open(mapsUrl, '_blank');
                }
              } else {
                alert('Адрес не указан');
              }
            }}
          />
        ))
      ) : (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Список клиентов пуст.
          </Typography>
        </Paper>
      )}

      <AddClientForm
        open={isAddFormOpen}
        onCancel={() => {
          setIsAddFormOpen(false);
          setEditingClient(null);
        }}
        onSave={handleCloseForm}
        client={editingClient || undefined}
      />
    </Box>
  );
}