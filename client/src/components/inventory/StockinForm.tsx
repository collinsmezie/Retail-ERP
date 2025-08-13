"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockIn, getProducts } from '../../lib/api';
import { useState, useEffect } from 'react';
import { Stack, TextField, MenuItem, Button, Alert, CircularProgress, Box, Typography } from '@mui/material';

const stockinSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  source: z.enum(['supplier', 'warehouse']),
  reference: z.string().optional(),
  stockedInBy: z.string().min(1, 'Stocked in by is required'),
});

type StockinFormValues = z.infer<typeof stockinSchema>;

export default function StockinForm({ defaultProductId, productName }: { defaultProductId?: string; productName?: string }) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<StockinFormValues>({
    resolver: zodResolver(stockinSchema),
    defaultValues: { product: '', quantity: 1, source: 'supplier', reference: '', stockedInBy: 'Current User' },
  });
  useEffect(() => {
    if (defaultProductId) {
      // Prefill selected product
      // Using setValue via control is more complex; easiest is reset with same other values
      reset((prev) => ({ ...(prev as any), product: defaultProductId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultProductId]);
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { data: products, isLoading: productsLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const mutation = useMutation({
    mutationFn: async (data: StockinFormValues) => stockIn({
      productId: data.product,
      quantity: data.quantity,
      source: data.source,
      referenceId: data.reference,
      receivedBy: data.stockedInBy,
    }),
    onSuccess: (_result, variables) => { 
      setNotice('Stock in successful'); 
      reset(); 
      // Optimistically bump lastUpdated for the item in cache
      queryClient.setQueryData<any>(['inventory'], (old: any) => {
        if (!old) return old;
        const patch = (list: any[]) => list.map((it: any) => it.productId === variables.product ? { ...it, quantity: (it.quantity ?? 0) + variables.quantity, updatedAt: new Date().toISOString() } : it);
        if (Array.isArray(old)) {
          return patch(old);
        }
        if (old.items && Array.isArray(old.items)) {
          return { ...old, items: patch(old.items) };
        }
        return old;
      });
      // Invalidate inventory query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (e: any) => setError(e.message || 'Failed to stock in'),
  });

  const onSubmit = (data: StockinFormValues) => { setError(''); setNotice(''); mutation.mutate(data); };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2}}>
      <Stack spacing={2}>
        {productName && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'rgba(25, 118, 210, 0.08)', 
            borderRadius: 1, 
            border: '1px solid',
            borderColor: 'primary.main',
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="primary.main" fontWeight={600}>
              {productName}
            </Typography>
          </Box>
        )}

        <Controller name="quantity" control={control} render={({ field }) => (
          <TextField
            type="number"
            size="small"
            label="Quantity"
            fullWidth
            inputProps={{ min: 1 }}
            value={field.value}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )} />

        <Controller name="source" control={control} render={({ field }) => (
          <TextField select size="small" label="Source" fullWidth {...field}>
            <MenuItem value="supplier">Supplier</MenuItem>
            <MenuItem value="warehouse">Warehouse</MenuItem>
          </TextField>
        )} />

        <Controller name="reference" control={control} render={({ field }) => (
          <TextField size="small" label="Reference (optional)" fullWidth {...field} />
        )} />

        <Controller name="stockedInBy" control={control} render={({ field }) => (
          <TextField size="small" label="Stocked In By" fullWidth disabled {...field} />
        )} />

        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        {notice && <Alert severity="success" variant="outlined">{notice}</Alert>}

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button type="submit" size="large" variant="contained" disabled={mutation.status === 'pending'}>
        {mutation.status === 'pending' ? 'Stocking in…' : 'Stock In'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
} 