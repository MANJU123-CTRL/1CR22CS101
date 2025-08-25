import { useMemo, useState } from "react";
import { getAllMaps, getClicks, removeMap } from "../services/storage";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Button, Chip, Stack, Typography, Divider, Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

export default function Stats() {
  const [nonce, setNonce] = useState(0); // trigger refresh
  const maps = useMemo(() => Object.values(getAllMaps()), [nonce]);

  const base = window.location.origin;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Shortener Statistics
      </Typography>

      {!maps.length && <Typography>No short links yet.</Typography>}

      <Stack spacing={2}>
        {maps.map((m) => {
          const clicks = getClicks(m.code);
          return (
            <Accordion key={m.code}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Chip label={`/${m.code}`} />
                  <Typography sx={{ wordBreak: "break-all" }}>{m.url}</Typography>
                  <Chip color="primary" label={`Total clicks: ${clicks.length}`} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Short URL: {base}/{m.code}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Created: {dayjs(m.createdAt).format("DD MMM YYYY, HH:mm")} • Expires:{" "}
                  {dayjs(m.expiresAt).format("DD MMM YYYY, HH:mm")}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Click details:
                </Typography>
                {!clicks.length && <Typography variant="body2">No clicks yet.</Typography>}
                {clicks.map((c, i) => (
                  <Stack key={i} direction="row" spacing={2} sx={{ mb: 0.5 }} flexWrap="wrap">
                    <Typography variant="body2">
                      Time: {dayjs(c.ts).format("DD MMM YYYY, HH:mm:ss")}
                    </Typography>
                    <Typography variant="body2">Source: {c.source || "direct"}</Typography>
                    <Typography variant="body2">Location: {c.coarseGeo}</Typography>
                  </Stack>
                ))}

                <Divider sx={{ my: 1 }} />
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    removeMap(m.code);
                    localStorage.removeItem("amtl_clicks_" + m.code);
                    setNonce((n) => n + 1);
                  }}
                >
                  Delete this short link
                </Button>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
}
