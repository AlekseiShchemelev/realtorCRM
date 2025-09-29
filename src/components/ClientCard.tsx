// src/components/ClientCard.tsx
import { useState } from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
import ActionMenu from './ActionMenu';
import PropertyGallery from './PropertyGallery';
import type { Client } from '../types';
import { Link as LinkIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
  onMarkCancelled: () => void;
  onShowOnMap: () => void;
  onShowRoute: () => void;
}

export default function ClientCard({
  client,
  onEdit,
  onDelete,
  onMarkCompleted,
  onMarkCancelled,
  onShowOnMap,
  onShowRoute,
}: ClientCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  const openPropertyGallery = (photos: string[]) => {
    setGalleryPhotos(photos);
    setIsGalleryOpen(true);
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}>
      {/* Миниатюра */}
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

      {/* Основная информация */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1">{client.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {client.phone}
        </Typography>
        <Typography variant="caption">{client.address}</Typography>

        {/* Комментарии */}
        {client.comments && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: '0.85rem',
              fontStyle: 'italic',
              lineHeight: 1.4,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {client.comments}
          </Typography>
        )}

        {/* Ссылка на объявление */}
        {client.listingUrl && (
          <Box sx={{ mt: 0.5 }}>
            <Button
              component="a"
              href={client.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 'medium',
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                  borderColor: 'primary.dark',
                },
              }}
              startIcon={<LinkIcon fontSize="small" />}
            >
              Объявление
            </Button>
          </Box>
        )}

        {/* Дата встречи */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {new Date(client.meetingDate).toLocaleDateString()}<br />
          {new Date(client.meetingDate).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>

      {/* Действия */}
      <Box>
        <ActionMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkCompleted={onMarkCompleted}
          onMarkCancelled={onMarkCancelled}
          onShowOnMap={onShowOnMap}
          onShowRoute={onShowRoute}
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