import { useState } from "react";
import {
  Alert, Button, Card, CardContent, Chip, Divider, Stack, Typography, Box, IconButton, Tooltip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UrlRow from "../components/UrlRow";
import { shortenBatch } from "../services/shortener";
import { addMap } from "../services/storage";
import dayjs from "dayjs";
import { logInfo } from "../services/logger";

const empty = () => ({ longUrl: "", minutes: "", preferredCode: "" });

export default function Shortener() {
  const [rows, setRows] = useState([empty()]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [created, setCreated] = useState([]);

  const changeRow = (i, v) => setRows((r) => r.map((x, idx) => (idx === i ? v : x)));

  const addRow = () => setRows((r) => (r.length >= 5 ? r : [...r, empty()]));
  const removeExtras = () => setRows((r) => r.filter((x) => x.longUrl.trim())); // clean blanks

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setCreated([]);

    const validRows = rows.filter((r) => r.longUrl.trim());
    const { results, errors: es } = shortenBatch(validRows);

    es?.length && setErrors(es);
    if (results?.length) {
      const saved = results.map(addMap);
      setCreated(saved);
      logInfo("SHORT_LINKS_CREATED", { count: saved.length });
    }
    setSubmitting(false);
  };

  const shortBase = `${window.location.origin}`; // http://localhost:3000

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Shorten up to 5 URLs
      </Typography>

      {rows.map((row, i) => (
        <UrlRow key={i} row={row} onChange={changeRow} index={i} disabled={submitting} />
      ))}

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={addRow} disabled={rows.length >= 5 || submitting}>
          Add another URL
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          Create Short Links
        </Button>
        <Button color="secondary" onClick={removeExtras} disabled={submitting}>
          Remove empty rows
        </Button>
      </Stack>

      {!!errors.length && (
        <Stack sx={{ mb: 2 }} spacing={1}>
          {errors.map((e, i) => (
            <Alert key={i} severity="error">
              Row {e.index + 1}: {e.message}
            </Alert>
          ))}
        </Stack>
      )}

      {!!created.length && (
        <Stack spacing={2}>
          <Divider />
          <Typography variant="h6">Created Links</Typography>
          {created.map((c) => {
            const full = `${shortBase}/${c.code}`;
            return (
              <Card key={c.code} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Chip label={`/${c.code}`} />
                    <Typography sx={{ wordBreak: "break-all" }}>{c.url}</Typography>
                    <Tooltip title="Copy short URL">
                      <IconButton
                        onClick={() => navigator.clipboard.writeText(full)}
                        aria-label="copy"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Created: {dayjs(c.createdAt).format("DD MMM YYYY, HH:mm")}
                    {" • "}
                    Expires: {dayjs(c.expiresAt).format("DD MMM YYYY, HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
