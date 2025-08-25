import { Grid, TextField } from "@mui/material";

export default function UrlRow({ row, onChange, index, disabled }) {
  const handle = (k) => (e) => onChange(index, { ...row, [k]: e.target.value });
  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Original long URL"
          fullWidth
          value={row.longUrl}
          onChange={handle("longUrl")}
          disabled={disabled}
          required
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Validity (minutes, optional)"
          fullWidth
          value={row.minutes}
          onChange={handle("minutes")}
          disabled={disabled}
          type="number"
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Preferred shortcode (optional)"
          fullWidth
          value={row.preferredCode}
          onChange={handle("preferredCode")}
          disabled={disabled}
          placeholder="e.g., my-link-1"
        />
      </Grid>
    </Grid>
  );
}
