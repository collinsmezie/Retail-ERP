"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockOut, getProducts } from '../../lib/api';
import { useState } from 'react';
import { Stack, TextField, MenuItem, Button, Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { FormLoader } from '../ui/loading-spinner';

const stockoutSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  destinationType: z.enum(['customer', 'warehouse', 'supplier']),
  referenceId: z.string().optional(),
  handledBy: z.string().min(1, 'Handled by is required'),
  locationId: z.string().min(1, 'Location is required'),
});

type StockoutFormValues = z.infer<typeof stockoutSchema>;

export default function StockoutForm({ defaultProductId, productName }: { defaultProductId?: string; productName?: string }) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch } = useForm<StockoutFormValues>({
    resolver: zodResolver(stockoutSchema),
    defaultValues: { productId: '', quantity: 1, destinationType: 'customer', referenceId: '', handledBy: 'Current User', locationId: 'Main Store' },
  });
  
  // Debug: watch form values
  const formValues = watch();
  console.log('StockoutForm current form values:', formValues);
  useEffect(() => {
    console.log('StockoutForm useEffect - defaultProductId:', defaultProductId);
    if (defaultProductId) {
      reset((prev) => ({ ...(prev as any), productId: defaultProductId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultProductId]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const { data: products, isLoading: productsLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const mutation = useMutation({
    mutationFn: async (data: StockoutFormValues) => stockOut({
      productId: data.productId,
      quantity: data.quantity,
      destinationType: data.destinationType,
      referenceId: data.referenceId,
      handledBy: data.handledBy,
      locationId: data.locationId,
    }),
    onSuccess: (_result, variables) => { 
      setNotice('Stock out successful'); 
      reset(); 
      // Optimistically bump lastUpdated for the item in cache
      queryClient.setQueryData<any>(['inventory'], (old: any) => {
        if (!old) return old;
        const patch = (list: any[]) => list.map((it: any) => it.productId === variables.productId ? { ...it, quantity: Math.max(0, (it.quantity ?? 0) - variables.quantity), updatedAt: new Date().toISOString() } : it);
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
    onError: (e: any) => setError(e.message || 'Failed to stock out'),
  });

  const onSubmit = (data: StockoutFormValues) => { setError(''); setNotice(''); mutation.mutate(data); };

  if (productsLoading) {
    return <FormLoader text="Loading products..." />;
  }

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
          <TextField type="number" size="small" label="Quantity" fullWidth inputProps={{ min: 1 }}
            value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
        )} />

        <Controller name="destinationType" control={control} render={({ field }) => (
          <TextField select size="small" label="Destination" fullWidth {...field}>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="warehouse">Warehouse</MenuItem>
            <MenuItem value="supplier">Supplier</MenuItem>
          </TextField>
        )} />

        <Controller name="referenceId" control={control} render={({ field }) => (
          <TextField size="small" label="Reference ID" fullWidth {...field} />
        )} />

        <Controller name="locationId" control={control} render={({ field }) => (
          <TextField select size="small" label="Location" fullWidth {...field}>
            <MenuItem value="Main Store">Main Store</MenuItem>
            <MenuItem value="Warehouse A">Warehouse A</MenuItem>
            <MenuItem value="Warehouse B">Warehouse B</MenuItem>
          </TextField>
        )} />

        <Controller name="handledBy" control={control} render={({ field }) => (
          <TextField size="small" label="Handled By" fullWidth disabled {...field} />
        )} />

        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        {notice && <Alert severity="success" variant="outlined">{notice}</Alert>}

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button type="submit" size="large" variant="contained" disabled={mutation.status === 'pending'}>
        {mutation.status === 'pending' ? 'Stocking out…' : 'Stock Out'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
} 