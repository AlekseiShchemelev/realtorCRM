// src/components/VoiceTextField.tsx
import { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Mic as MicIcon } from '@mui/icons-material';
import { isSpeechRecognitionSupported, createSpeechRecognition } from '../utils/speechUtils';
import { useLongPress } from '../hooks/useLongPress';

interface VoiceTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  minRows?: number;
  type?: string;
  required?: boolean;
  onVoiceInput?: (text: string) => void;
}

export default function VoiceTextField({
  label,
  name,
  value,
  onChange,
  multiline = false,
  minRows = 1,
  type = 'text',
  required = false,
  onVoiceInput,
}: VoiceTextFieldProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Ваш браузер не поддерживает голосовой ввод. Используйте Chrome или Edge.');
      return;
    }

    const recognition = createSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      onVoiceInput?.(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert('Не удалось распознать речь.');
    };
  };

  const longPressHandlers = useLongPress(handleVoiceInput, 600);

  return (
    <Box
      sx={{ position: 'relative' }}
      {...longPressHandlers}
    >
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        fullWidth
        required={required}
        size="small"
        multiline={multiline}
        minRows={minRows}
        type={type}
        InputLabelProps={type === 'datetime-local' ? { shrink: true } : {}}
        sx={{ '& .MuiInputBase-root': { borderRadius: '12px' } }}
      />
      {isRecording && (
        <Box
          sx={{
            position: 'absolute',
            top: -24,
            right: 0,
            backgroundColor: 'error.main',
            color: 'white',
            px: 1,
            borderRadius: '4px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <MicIcon sx={{ fontSize: '0.9rem' }} />
          Говорите...
        </Box>
      )}
    </Box>
  );
}