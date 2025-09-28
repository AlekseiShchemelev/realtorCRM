// src/components/AddClientForm.tsx
import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from '@mui/material';
import { addClient, updateClient } from '../services/clientService';
import { addHistoryEntry } from '../services/historyService';
import type { Client } from '../types';
import { isSpeechRecognitionSupported, createSpeechRecognition } from '../utils/speechUtils';
import { parseVoiceInput } from '../utils/voiceParser';

interface AddClientFormProps {
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
  client?: Client;
}

export default function AddClientForm({ open, onCancel, onSave, client }: AddClientFormProps) {
  const initialData: Omit<Client, 'id' | 'createdAt'> = client
    ? {
        fullName: client.fullName,
        phone: client.phone,
        address: client.address,
        meetingDate: client.meetingDate.slice(0, 16), // "2025-09-24T19:00"
        status: client.status,
        propertyPhotos: client.propertyPhotos || [],
      }
    : {
        fullName: '',
        phone: '',
        address: '',
        meetingDate: new Date().toISOString().slice(0, 16),
        status: 'planned',
        propertyPhotos: [],
      };

  const [formData, setFormData] = useState(initialData);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (client) {
        setFormData({
          fullName: client.fullName,
          phone: client.phone,
          address: client.address,
          meetingDate: client.meetingDate.slice(0, 16),
          status: client.status,
          propertyPhotos: client.propertyPhotos || [],
        });
        setPhotos(client.propertyPhotos || []);
      } else {
        setFormData({
          fullName: '',
          phone: '',
          address: '',
          meetingDate: new Date().toISOString().slice(0, 16),
          status: 'planned',
          propertyPhotos: [],
        });
        setPhotos([]);
      }
    }
  }, [open, client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Ваш браузер не поддерживает голосовой ввод. Используйте Chrome или Edge.');
      return;
    }

    const recognition = createSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Распознано:', transcript);

      const parsed = parseVoiceInput(transcript);

      setFormData((prev) => ({
        ...prev,
        fullName: parsed.fullName || prev.fullName,
        phone: parsed.phone || prev.phone,
        address: parsed.address || prev.address,
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Ошибка голосового ввода:', event.error);
      alert('Не удалось распознать речь. Попробуйте снова.');
    };
  };

  const handleSave = async () => {
    try {
      const clientData: Omit<Client, 'id' | 'createdAt'> = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        meetingDate: formData.meetingDate, // ← это строка вида "2025-09-24T19:00"
        status: formData.status,
      };

      if (photos.length > 0) {
        clientData.propertyPhotos = photos;
      }

      if (client) {
        await updateClient(client.id!, clientData);
        await addHistoryEntry({
          clientId: client.id!,
          action: 'updated',
          details: `Обновлены данные: ${clientData.fullName}`,
        });
        alert('Клиент успешно обновлён!');
      } else {
        const newId = await addClient(clientData);
        await addHistoryEntry({
          clientId: newId,
          action: 'created',
          details: `Создан новый клиент: ${clientData.fullName}`,
        });
        alert('Клиент успешно добавлен!');
      }

      onSave();
    } catch (error) {
      console.error('Ошибка при сохранении клиента:', error);
      alert('Не удалось сохранить клиента. Попробуйте позже.');
    }
  };

  const title = client ? 'Редактировать клиента' : 'Добавить нового клиента';

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Голосовой ввод */}
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleVoiceInput} sx={{ minWidth: '160px', mb: 1 }}>
              🎤 Диктовать всё
            </Button>
            <Typography variant="body2" color="text.secondary">
              Пример: <i>«ФИО — Щемелев Алексей. Телефон — 9155151. Адрес — улица Ленина, 10»</i>
            </Typography>
          </Box>

          <TextField
            label="ФИО"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Адрес"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Дата и время встречи"
            name="meetingDate"
            type="datetime-local"
            value={formData.meetingDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Фото объекта */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Фото объекта (можно выбрать несколько)
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'block', marginBottom: '8px' }}
            />
            {photos.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Фото ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button variant="contained" onClick={handleSave}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}