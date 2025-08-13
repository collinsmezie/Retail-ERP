"use client";

import ClientDataGrid from '../common/ClientDataGrid';
import { useEffect, useMemo, useState } from 'react';
import AdjustmentModal from './AdjustmentModal';
import StockinForm from './StockinForm';
import StockoutForm from './StockoutForm';
import { useQuery } from '@tanstack/react-query';
import { getInventory } from '../../lib/api';
import { Button, Chip, Dialog, DialogTitle, DialogContent, Paper, Stack, Typography, Box } from '@mui/material';

import InventoryActions from './InventoryActions';

const getStatusChip = (status: string) => {
  if (status === 'In Stock') {
    return <Chip label={status} sx={{ color: '#22C55E', borderColor: '#22C55E' }} size="small" variant="outlined"/>;
  }
  if (status === 'Low Stock') {
    return <Chip label={status} color="warning" size="small" variant="outlined"/>;
  }
  if (status === 'Out of Stock') {
    return <Chip label={status} color="error" size="small" variant="outlined"/>;
  }
  return <Chip label={status} size="small" variant="outlined"/>;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const now = new Date();
  const isSameDay = (a: Date, b: Date) => (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );

  if (isSameDay(date, now)) {
    return 'Today';
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export default function InventoryTable() {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [stockinOpen, setStockinOpen] = useState(false);
  const [stockoutOpen, setStockoutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [clickedProduct, setClickedProduct] = useState<any>(null);
  
  // Convert selection to the format MUI DataGrid expects
  const selectionModel = useMemo(() => ({
    type: 'include' as const,
    ids: new Set(selection)
  }), [selection]);

  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { data, isLoading, error } = useQuery({ queryKey: ['inventory'], queryFn: getInventory });
  const items = useMemo(() => (Array.isArray(data) ? data : (data?.items ?? [])), [data]);

  const filtered = useMemo(() => {
    const qq = search.trim().toLowerCase();
    return items.filter((it: any) => {
      const matches = !qq || (it.name ?? '').toLowerCase().includes(qq) || (it.sku ?? '').toLowerCase().includes(qq);
      const low = it.lowStock || (it.quantity - it.reservedQuantity) <= it.reorderPoint;
      return matches && (!lowStockOnly || low);
    });
  }, [items, search, lowStockOnly]);

  const columns = useMemo(() => [
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
    { field: 'sku', headerName: 'SKU', width: 140 },
    { field: 'quantity', headerName: 'Stock Quantity', width: 160 },
    { field: 'reorderPoint', headerName: 'Reorder Point', width: 150 },
    { field: 'status', headerName: 'Status', width: 140, renderCell: ({ value }: any) => getStatusChip(value) },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 160, renderCell: ({ value }: any) => formatDate(value) },
  ], []);

  const rows = useMemo(() => filtered.map((it: any) => ({
    id: it.id,
    productId: it.productId,
    name: it.name,
    sku: it.sku,
    quantity: it.quantity,
    reorderPoint: it.reorderPoint,
    status: (it.quantity - it.reservedQuantity) <= it.reorderPoint ? (it.quantity === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock',
    lastUpdated: it.updatedAt || it.createdAt,
  })), [filtered]);

  if (isLoading) return <div className="p-6 text-sm text-slate-500">Loading inventory…</div>;
  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Failed to load inventory</div>;

  const summary = {
    total: items.length,
    low: items.filter((it: any) => (it.quantity - it.reservedQuantity) <= it.reorderPoint).length,
    out: items.filter((it: any) => it.quantity === 0).length,
  };

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Chip size="small" variant="outlined" label={summary.total} />
            <Typography variant="caption" color="text.secondary">Low</Typography>
            <Chip size="small" color="warning" variant="outlined" label={summary.low} />
            <Typography variant="caption" color="text.secondary">Out</Typography>
            <Chip size="small" color="error" variant="outlined" label={summary.out} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={() => setAdjustOpen(true)} disabled={selection.length === 0}>Adjust</Button>
            <Button variant="outlined" size="small" onClick={() => setStockinOpen(true)} disabled={selection.length === 0}>Stock In</Button>
            <Button variant="outlined" size="small" onClick={() => setStockoutOpen(true)} disabled={selection.length === 0}>Stock Out</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>

        <ClientDataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick={false}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(m: any) => {
            if (m && typeof m === 'object' && 'ids' in m && m.ids instanceof Set) {
              setSelection(Array.from(m.ids));
            } else if (Array.isArray(m)) {
              setSelection(m);
            } else {
              setSelection([]);
            }
          }}
          onRowClick={(params) => {
            setClickedProduct(params.row);
            setSelection([params.row.id]);
          }}
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(14, 165, 233, 0.05) !important',
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
              '& .MuiDataGrid-cell': {
                fontSize: '0.95rem',
                fontWeight: 500,
              }
            },
            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row[data-selected="true"]': {
              backgroundColor: 'rgba(14, 165, 233, 0.15) !important',
              '& .MuiDataGrid-cell': {
                fontSize: '0.95rem',
                fontWeight: 500,
              }
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            },
            '& .MuiDataGrid-row:hover .MuiDataGrid-cell': {
              backgroundColor: 'rgba(14, 165, 233, 0.05) !important',
            }
          }}
        />
      </Paper>

      {mounted && (
        <>
          <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Adjust Stock - {clickedProduct?.name}</DialogTitle>
            <DialogContent>
              <AdjustmentModal open={true} onClose={() => setAdjustOpen(false)} defaultProductId={clickedProduct?.productId} productName={clickedProduct?.name} />
            </DialogContent>
          </Dialog>

          <Dialog open={stockinOpen} onClose={() => setStockinOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Stock In - {clickedProduct?.name}</DialogTitle>
            <DialogContent>
              <StockinForm defaultProductId={clickedProduct?.productId} productName={clickedProduct?.name} />
            </DialogContent>
          </Dialog>

          <Dialog open={stockoutOpen} onClose={() => setStockoutOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Stock Out - {clickedProduct?.name}</DialogTitle>
            <DialogContent>
              <StockoutForm defaultProductId={clickedProduct?.productId} productName={clickedProduct?.name} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
} 