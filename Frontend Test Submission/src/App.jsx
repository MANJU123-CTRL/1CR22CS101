import { Routes, Route, Link as RouterLink, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar, Box, Button, Container, Toolbar, Typography, Stack
} from "@mui/material";
import theme from "./theme";
import Shortener from "./pages/Shortener";
import Stats from "./pages/Stats";
import Redirector from "./routes/Redirector";

function Nav() {
  const loc = useLocation();
  const at = (p) => loc.pathname === p;
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          URL Shortener
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={at("/") ? "outlined" : "text"}
          >
            Shorten
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/stats"
            variant={at("/stats") ? "outlined" : "text"}
          >
            Statistics
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Nav />
        <Container sx={{ py: 3 }}>
          <Routes>
            {/* Redirect route must be first to catch /:code when it matches */}
            <Route path="/:code" element={<Redirector />} />
            <Route path="/" element={<Shortener />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
