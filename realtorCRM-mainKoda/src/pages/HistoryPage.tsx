import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Download,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import type { HistoryEntry } from "../types";
import { getHistory, clearHistory } from "../services/historyService";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleExportToExcel = () => {
    const csvContent = [
      ["Дата", "Действие", "Клиент ID", "Детали"],
      ...history.map((h) => [
        new Date(h.timestamp).toLocaleString(),
        h.action,
        h.clientId,
        h.details || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "history.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = async () => {
    if (window.confirm("Вы уверены, что хотите очистить всю историю?")) {
      await clearHistory();
      setHistory([]);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("добавлен")) return "➕";
    if (action.includes("изменен")) return "✏️";
    if (action.includes("удален")) return "🗑️";
    if (action.includes("встреча")) return "📅";
    return "📋";
  };

  const getActionColor = (action: string) => {
    if (action.includes("добавлен")) return "success";
    if (action.includes("изменен")) return "info";
    if (action.includes("удален")) return "error";
    if (action.includes("встреча")) return "warning";
    return "default";
  };

  return (
    <Box
      className="content-wrapper fade-in"
      sx={{ width: "100%", maxWidth: "100%", mx: "auto" }}
    >
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: { xs: 1, sm: 2 },
          }}
        >
          <HistoryIcon
            sx={{ fontSize: { xs: 28, sm: 32 }, color: "primary.main" }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            История действий
          </Typography>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Здесь отображаются все изменения в списке клиентов и операции с
          данными.
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
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExportToExcel}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            height: { xs: 48, sm: 56 },
            borderRadius: "12px",
            px: { xs: 3, sm: 2 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            fontWeight: 600,
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.lighter",
              borderColor: "primary.dark",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Экспорт истории
          </Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Экспорт в Excel
          </Box>
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearIcon />}
          onClick={handleClearAll}
          disabled={history.length === 0}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            height: { xs: 48, sm: 56 },
            borderRadius: "12px",
            px: { xs: 3, sm: 2 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            fontWeight: 600,
            bgcolor: "error.main",
            "&:hover": {
              bgcolor: "error.dark",
            },
            "&:disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Очистить историю
          </Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Очистить данные
          </Box>
        </Button>
      </Box>

      {history.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(320px, 1fr))",
              md: "repeat(auto-fill, minmax(380px, 1fr))",
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {history.map((entry) => (
            <Paper
              key={entry.id!}
              elevation={1}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  elevation: 2,
                  borderColor: "primary.main",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    backgroundColor: `${getActionColor(entry.action)}.light`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  {getActionIcon(entry.action)}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      wordBreak: "break-word",
                      lineHeight: 1.4,
                      mb: 0.5,
                    }}
                  >
                    {entry.action}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      mb: 1,
                    }}
                  >
                    📅{" "}
                    {new Date(entry.timestamp).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    👤 ID клиента: {entry.clientId}
                  </Typography>

                  {entry.details && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        fontStyle: "italic",
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      💬 {entry.details}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
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
              backgroundColor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <HistoryIcon sx={{ fontSize: 32, color: "text.secondary" }} />
          </Box>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
          >
            История пуста
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 300 }}
          >
            История действий появится здесь после первых операций с клиентами
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
