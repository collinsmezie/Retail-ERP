"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Topbar({ title, actionHref = "/products?create=1", actionLabel = "New Product", onActionClick }: { title: string; actionHref?: string; actionLabel?: string; onActionClick?: () => void }) {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar variant="dense">
        <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {onActionClick ? (
            <Button variant="contained" size="small" startIcon={<AddIcon fontSize="small"/>} onClick={onActionClick}>
              {actionLabel}
            </Button>
          ) : (
            <Link href={actionHref}>
              <Button variant="contained" size="small" startIcon={<AddIcon fontSize="small"/>}>{actionLabel}</Button>
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
} 