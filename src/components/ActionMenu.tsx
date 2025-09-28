// src/components/ActionMenu.tsx
import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  LocationOn,
  Directions,
} from '@mui/icons-material';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
  onMarkCancelled: () => void;
  onShowOnMap: () => void;
  onShowRoute: () => void; // новая функция
}

export default function ActionMenu({
  onEdit,
  onDelete,
  onMarkCompleted,
  onMarkCancelled,
  onShowOnMap,
  onShowRoute,
}: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { onEdit(); handleClose(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Изменить данные</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onShowOnMap(); handleClose(); }}>
          <ListItemIcon><LocationOn fontSize="small" /></ListItemIcon>
          <ListItemText>Показать на карте</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onShowRoute(); handleClose(); }}>
          <ListItemIcon><Directions fontSize="small" /></ListItemIcon>
          <ListItemText>Проложить маршрут</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onMarkCompleted(); handleClose(); }} sx={{ color: 'green' }}>
          <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
          <ListItemText>Встреча состоялась</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onMarkCancelled(); handleClose(); }} sx={{ color: 'orange' }}>
          <ListItemIcon><Cancel fontSize="small" /></ListItemIcon>
          <ListItemText>Встреча отменена</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleClose(); }} sx={{ color: 'red' }}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <ListItemText>Удалить</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}