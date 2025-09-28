// src/components/ClientCard.tsx
import { useState } from 'react';
import { Card, CardMedia, Typography, Box } from '@mui/material';
import ActionMenu from './ActionMenu';
import PropertyGallery from './PropertyGallery';
import type { Client } from '../types';

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
  onMarkCancelled: () => void;
  onShowOnMap: () => void;
  onShowRoute: () => void; // ← добавлено
}

export default function ClientCard({
  client,
  onEdit,
  onDelete,
  onMarkCompleted,
  onMarkCancelled,
  onShowOnMap,
  onShowRoute, // ← добавлено
}: ClientCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  const openPropertyGallery = (photos: string[]) => {
    setGalleryPhotos(photos);
    setIsGalleryOpen(true);
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}>
      {/* Миниатюра: первое фото объекта или аватар */}
      <Box sx={{ position: 'relative', mr: 1 }}>
        <CardMedia
          component="img"
          sx={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover' }}
          image={
            client.propertyPhotos?.[0] ||
            '/default-avatar.png'
          }
          alt="Фото объекта"
        />
        {/* Метка с количеством фото (если >1) */}
        {client.propertyPhotos && client.propertyPhotos.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              openPropertyGallery(client.propertyPhotos!);
            }}
          >
            +{client.propertyPhotos.length - 1}
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1">{client.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {client.phone}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography variant="body2">{client.address}</Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography variant="body2">
          {new Date(client.meetingDate).toLocaleDateString()}<br />
          {new Date(client.meetingDate).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
      <Box>
        <ActionMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkCompleted={onMarkCompleted}
          onMarkCancelled={onMarkCancelled}
          onShowOnMap={onShowOnMap}
          onShowRoute={onShowRoute} // ← передаём
        />
      </Box>

      {/* Галерея фото */}
      <PropertyGallery
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        photos={galleryPhotos}
      />
    </Card>
  );
}