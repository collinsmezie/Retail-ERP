"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adjustStock } from '../../lib/api';
import { useState } from 'react';
import { Stack, TextField, MenuItem, Button, Alert, Box, Typography } from '@mui/material';
import { useEffect } from 'react';

const adjustmentSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  adjustmentType: z.enum(['increase', 'decrease']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.enum(['stocktake', 'damage', 'return', 'correction']),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export default function AdjustmentModal({ open = false, onClose, defaultProductId, productName }: { open?: boolean; onClose?: () => void; defaultProductId?: string; productName?: string }) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { product: '', adjustmentType: 'increase', quantity: 1, reason: 'stocktake' },
  });
  useEffect(() => {
    if (defaultProductId) {
      reset((prev) => ({ ...(prev as any), product: defaultProductId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultProductId]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: AdjustmentFormValues) => adjustStock({
      productId: data.product,
      adjustmentType: data.adjustmentType,
      quantity: data.quantity,
      reason: data.reason,
      performedBy: 'Current User',
    }),
    onSuccess: () => { 
      setSuccess(true); 
      reset(); 
      // Invalidate inventory query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      // Do not auto-close; show success indicator like other modals
    },
    onError: (e: any) => setError(e.message || 'Failed to adjust stock'),
  });

  const onSubmit = (data: AdjustmentFormValues) => { setError(''); mutation.mutate(data); };

  if (!open) return null;

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

        <Controller name="adjustmentType" control={control} render={({ field }) => (
          <TextField select size="small" label="Adjustment Type" fullWidth {...field}>
            <MenuItem value="increase">Increase</MenuItem>
            <MenuItem value="decrease">Decrease</MenuItem>
          </TextField>
        )} />

        <Controller name="quantity" control={control} render={({ field }) => (
          <TextField type="number" size="small" label="Quantity" fullWidth inputProps={{ min: 1 }}
            value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
        )} />

        <Controller name="reason" control={control} render={({ field }) => (
          <TextField select size="small" label="Reason" fullWidth {...field}>
            <MenuItem value="stocktake">Stocktake</MenuItem>
            <MenuItem value="damage">Damage</MenuItem>
            <MenuItem value="return">Return</MenuItem>
            <MenuItem value="correction">Correction</MenuItem>
          </TextField>
        )} />

        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        {success && <Alert severity="success" variant="outlined">Stock adjusted successfully!</Alert>}

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button type="button" variant="outlined" size="large" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" size="large" disabled={mutation.status === 'pending'}>
          {mutation.status === 'pending' ? 'Adjusting…' : 'Adjust Stock'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
} 