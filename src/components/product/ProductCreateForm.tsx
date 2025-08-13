"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createProduct } from '../../lib/api';
import { useState } from 'react';
import { Box, Paper, Stack, TextField, Button, Typography, Alert } from '@mui/material';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be at least 0'),
  cost: z.number().min(0, 'Cost must be at least 0').optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductCreateForm() {
  const { control, handleSubmit, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', sku: '', price: 0, cost: 0, category: '', brand: '' },
  });
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async (data: ProductFormValues) => createProduct(data),
    onSuccess: () => { setNotice('Product created successfully'); reset(); },
    onError: (e: any) => setError(e.message || 'Failed to create product'),
  });

  const onSubmit = (data: ProductFormValues) => { setError(''); setNotice(''); mutation.mutate(data); };

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>New Product</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.5}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Product Name"
                size="small"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="sku"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="SKU"
                size="small"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Price"
                  size="small"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ flex: 1 }}
                />
              )}
            />
            <Controller
              name="cost"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Cost"
                  size="small"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ flex: 1 }}
                />
              )}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField label="Category" size="small" {...field} sx={{ flex: 1 }} />
              )}
            />
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <TextField label="Brand" size="small" {...field} sx={{ flex: 1 }} />
              )}
            />
          </Stack>

          {error && <Alert severity="error" variant="outlined">{error}</Alert>}
          {notice && <Alert severity="success" variant="outlined">{notice}</Alert>}

          <Stack direction="row" spacing={1}>
            <Button 
              type="submit" 
              variant="contained" 
              size="small" 
              disabled={mutation.status === 'pending'}
              startIcon={mutation.status === 'pending' ? <Loader2 size={16} /> : undefined}
            >
              {mutation.status === 'pending' ? 'Creating...' : 'Create Product'}
            </Button>
            <Button type="button" variant="outlined" size="small" onClick={() => reset()}>Reset</Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
} 