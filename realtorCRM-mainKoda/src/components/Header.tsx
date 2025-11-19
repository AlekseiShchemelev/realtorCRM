// src/components/Header.tsx
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { usePreloadComponents } from "../hooks/usePreloadComponents";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Предзагрузка компонентов при наведении
  const { preloadOnHover } = usePreloadComponents();

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: { xs: 1, sm: 1.5, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 6, sm: 8 },
          textDecoration: "none",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            borderRadius: { xs: "6px", sm: "8px" },
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: { xs: "12px", sm: "14px" },
            flexShrink: 0,
          }}
        >
          R
        </Box>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          fontWeight="bold"
          color="text.primary"
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: "120px", sm: "none" },
          }}
        >
          RealtorCRM
        </Typography>
      </Link>

      {/* Навигация для десктопа и планшетов */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          gap: { sm: 1, md: 1.5 },
          alignItems: "center",
        }}
      >
        <Button
          component={Link}
          to="/calendar"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: "auto",
            px: { sm: 1.5, md: 2 },
            borderRadius: "12px",
            py: { sm: 0.75, md: 1 },
          }}
          startIcon={<CalendarMonthIcon fontSize="small" />}
          onMouseEnter={preloadOnHover(
            () => import("../pages/CalendarPage"),
            "CalendarPage"
          )}
        >
          <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
            Календарь
          </Box>
        </Button>
        <Button
          component={Link}
          to="/profile"
          variant="contained"
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: "auto",
            px: { sm: 1.5, md: 2 },
            borderRadius: "12px",
            py: { sm: 0.75, md: 1 },
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          startIcon={<PersonIcon fontSize="small" />}
          onMouseEnter={preloadOnHover(
            () => import("../pages/ProfilePage"),
            "ProfilePage"
          )}
        >
          <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
            Профиль
          </Box>
        </Button>
      </Box>

      {/* Мобильное меню */}
      {isMobile && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            to="/calendar"
            variant="outlined"
            size="small"
            sx={{
              minWidth: "auto",
              px: 1.5,
              borderRadius: "12px",
              minHeight: 40,
            }}
            onMouseEnter={preloadOnHover(
              () => import("../pages/CalendarPage"),
              "CalendarPage"
            )}
          >
            <CalendarMonthIcon fontSize="small" />
          </Button>
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            size="small"
            sx={{
              minWidth: "auto",
              px: 1.5,
              borderRadius: "12px",
              minHeight: 40,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onMouseEnter={preloadOnHover(
              () => import("../pages/ProfilePage"),
              "ProfilePage"
            )}
          >
            <PersonIcon fontSize="small" />
          </Button>
        </Box>
      )}
    </Box>
  );
}
