// src/hooks/useMeetingNotifications.ts
import { useEffect } from 'react';
import { getClientsByDate } from '../services/clientService';

export const useMeetingNotifications = () => {
  useEffect(() => {
    const checkUpcomingMeetings = async () => {
      const now = new Date();
      const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
      
      const meetings = await getClientsByDate(fifteenMinutesLater);
      meetings.forEach(client => {
        if (Notification.permission === 'granted') {
          new Notification('Напоминание о встрече', {
            body: `Встреча с ${client.fullName} через 15 минут`,
            icon: '/icons/icon-192x192.png'
          });
        }
      });
    };

    const interval = setInterval(checkUpcomingMeetings, 60 * 1000); // проверка каждую минуту
    return () => clearInterval(interval);
  }, []);
};