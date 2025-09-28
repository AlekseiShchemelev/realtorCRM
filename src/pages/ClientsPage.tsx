import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
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
    setIsAddFormOpen(true); // открываем форму
  };

  const handleUpdateClient = async (id: string, updatedData: Partial<Client>) => {
    await updateClient(id, updatedData);
    loadClients();
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Удалить клиента?')) {
      await deleteClient(id);
      loadClients();
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddFormOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Клиенты</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Управляйте списком ваших клиентов и встреч.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по имени, адресу или телефону..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <Button variant="contained" onClick={handleAddClient}>Добавить</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 1, borderBottom: '1px solid #ddd', pb: 1 }}>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>Фото</Typography>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>ФИО</Typography>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>Телефон</Typography>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>Адрес</Typography>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>Дата встречи</Typography>
        <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>Действия</Typography>
      </Box>

      {filteredClients.length > 0 ? (
        filteredClients.map(client => (
          <ClientCard
            key={client.id!}
            client={client}
            onEdit={() => handleEditClient(client)} 
            onDelete={() => handleDeleteClient(client.id!)}
            onMarkCompleted={() => handleUpdateClient(client.id!, { status: 'completed' })}
            onMarkCancelled={() => handleUpdateClient(client.id!, { status: 'cancelled' })}
            onShowOnMap={() => {
              const address = client.address.trim();
              if (address) {
                const encoded = encodeURIComponent(address);
                // Открываем Яндекс.Карты
                window.open(`https://yandex.ru/maps/?text=${encoded}`, '_blank');
              } else {
                alert('Адрес не указан');
              }
            }}
            onShowRoute={() => {
              const address = client.address.trim();
              if (address) {
                const encoded = encodeURIComponent(address);
                // Пытаемся открыть Яндекс.Навигатор (на телефоне)
                const naviUrl = `yandexnavi://build_route_on_map?&lat=0&lon=0&to=${encoded}`;
                const mapsUrl = `https://yandex.ru/maps/?rtext=~${encoded}&rtt=auto`;

                // Сначала пробуем навигатор, если не получится — карты
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
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Список клиентов пуст.
        </Typography>
      )}
      
      <AddClientForm
        open={isAddFormOpen}
        onCancel={() => {
          setIsAddFormOpen(false);
          setEditingClient(null);
          // не обновляем список — просто закрываем
        }}
        onSave={() => {
          setIsAddFormOpen(false);
          setEditingClient(null);
          setSearchTerm(''); // сбрасываем поиск
          loadClients();     // 👈 обновляем список ТОЛЬКО после сохранения
        }}
        client={editingClient || undefined}
      />
    </Box>
  );
}