// src/pages/ClientsPage.tsx
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import ClientCard from "../components/ClientCard";
import type { Client } from "../types";
import {
  getClients,
  updateClient,
  deleteClient,
} from "../services/clientService";
import AddClientForm from "../components/AddClientForm";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const filteredClients = clients.filter(
    (client) =>
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
    setSearchTerm("");
    loadClients();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddFormOpen(true);
  };

  const handleUpdateClient = async (
    id: string,
    updatedData: Partial<Client>
  ) => {
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
    <Box
      className="content-wrapper fade-in"
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
      }}
    >
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            mb: { xs: 1, sm: 2 },
          }}
        >
          Клиенты
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            mb: { xs: 1.5, sm: 2 },
          }}
        >
          Управляйте списком ваших клиентов и встреч.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Поиск по ФИО, телефону или адресу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: { xs: "1", sm: "1" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& .MuiInputBase-input": {
              py: { xs: 1.25, sm: 1.5 },
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddClient}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            height: { xs: 48, sm: 56 },
            borderRadius: "12px",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            px: { xs: 3, sm: 2 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            },
          }}
          startIcon={<AddIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />}
        >
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Добавить клиента
          </Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Добавить
          </Box>
        </Button>
      </Box>

      {filteredClients.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(320px, 1fr))",
              md: "repeat(auto-fill, minmax(380px, 1fr))",
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            width: "100%",
          }}
        >
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id!}
              client={client}
              onEdit={() => handleEditClient(client)}
              onDelete={() => handleDeleteClient(client.id!, client.fullName)}
              onMarkCompleted={() =>
                handleUpdateClient(client.id!, { status: "completed" })
              }
              onMarkCancelled={() =>
                handleUpdateClient(client.id!, { status: "cancelled" })
              }
              onShowOnMap={() => {
                const address = client.address.trim();
                if (address) {
                  const encoded = encodeURIComponent(address);
                  window.open(
                    `https://yandex.ru/maps/?text=${encoded}`,
                    "_blank"
                  );
                } else {
                  alert("Адрес не указан");
                }
              }}
              onShowRoute={() => {
                const address = client.address.trim();
                if (address) {
                  const encoded = encodeURIComponent(address);
                  const naviUrl = `yandexnavi://build_route_on_map?&lat=0&lon=0&to=${encoded}`;
                  const mapsUrl = `https://yandex.ru/maps/?rtext=~${encoded}&rtt=auto`;
                  const win = window.open(naviUrl, "_blank");
                  if (!win || win.closed || win.outerHeight === 0) {
                    window.open(mapsUrl, "_blank");
                  }
                } else {
                  alert("Адрес не указан");
                }
              }}
            />
          ))}
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            borderRadius: "16px",
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <SearchIcon sx={{ fontSize: 32, color: "primary.main" }} />
          </Box>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
          >
            {searchTerm ? "Клиенты не найдены" : "Список клиентов пуст"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 300 }}
          >
            {searchTerm
              ? "Попробуйте изменить параметры поиска"
              : "Добавьте первого клиента для начала работы"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              onClick={handleAddClient}
              sx={{
                mt: 1,
                borderRadius: "12px",
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
              startIcon={<AddIcon />}
            >
              Добавить первого клиента
            </Button>
          )}
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
