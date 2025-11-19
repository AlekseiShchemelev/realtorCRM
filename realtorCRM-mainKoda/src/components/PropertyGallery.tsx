// src/components/PropertyGallery.tsx
import { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface PropertyGalleryProps {
  open: boolean;
  onClose: () => void;
  photos: string[];
}

export default function PropertyGallery({ open, onClose, photos }: PropertyGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrev = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent sx={{ padding: 0, backgroundColor: '#000', position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={goToPrev}
              sx={{
                position: 'absolute',
                left: 16,
                color: 'white',
                zIndex: 10,
              }}
            >
              ❮
            </IconButton>

            <img
              src={photos[currentPhotoIndex]}
              alt={`Фото ${currentPhotoIndex + 1}`}
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />

            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: 16,
                color: 'white',
                zIndex: 10,
              }}
            >
              ❯
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}