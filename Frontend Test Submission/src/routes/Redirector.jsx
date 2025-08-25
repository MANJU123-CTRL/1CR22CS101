import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { getMap, recordClick } from "../services/storage";
import dayjs from "dayjs";

const coarseGeo = () => {
 
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
  const lang = navigator.language || "en";
  return `${tz} / ${lang}`;
};

export default function Redirector() {
  const { code } = useParams();
  const [state, setState] = useState({ msg: "Redirecting...", ok: true });

  useEffect(() => {
    const m = getMap(code);
    if (!m) {
      setState({ ok: false, msg: "Short link not found." });
      return;
    }
    if (dayjs().isAfter(dayjs(m.expiresAt))) {
      setState({ ok: false, msg: "This short link has expired." });
      return;
    }
    
    recordClick(code, {
      ts: new Date().toISOString(),
      source: document.referrer || "direct",
      coarseGeo: coarseGeo(),
    });
    window.location.replace(m.url);
  }, [code]);

  if (state.ok) return null;

  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      <Alert severity="error">{state.msg}</Alert>
      <Button variant="contained" component={RouterLink} to="/">
        Go to Shortener
      </Button>
    </Stack>
  );
}
