"use client";

import { useId } from 'react';
import { TextField, FormControlLabel, Switch, Box } from '@mui/material';

export default function InventoryActions({
  search,
  onSearchChange,
  lowStockOnly,
  onLowStockChange,
  rightActions,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  lowStockOnly: boolean;
  onLowStockChange: (v: boolean) => void;
  rightActions?: React.ReactNode;
}) {
  const switchId = useId();
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        label="Search by Product or SKU"
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 260, bgcolor: 'background.paper' }}
      />
      <FormControlLabel
        sx={{ ml: 0.5 }}
        control={<Switch id={switchId} checked={lowStockOnly} onChange={(e) => onLowStockChange(e.target.checked)} color="primary" />}
        label="Low Stock Only"
      />
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>{rightActions}</Box>
    </Box>
  );
} 