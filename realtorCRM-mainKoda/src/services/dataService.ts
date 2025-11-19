// src/services/dataService.ts
import { clearHistory } from './historyService';
import { deleteClient } from './clientService';
import { getClients } from './clientService';

export const clearAllData = async () => {
  // 1. Удаляем всех клиентов
  const clients = await getClients();
  const deleteClientPromises = clients.map(client => deleteClient(client.id!));
  await Promise.all(deleteClientPromises);

  // 2. Очищаем историю
  await clearHistory();
};