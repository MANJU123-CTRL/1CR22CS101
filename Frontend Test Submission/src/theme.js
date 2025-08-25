import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: { mode: "light" },
  shape: { borderRadius: 16 },
  typography: { fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial` },
});

export default theme;
