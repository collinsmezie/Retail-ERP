"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../lib/api';
import SidebarNav from '../../../components/layout/SidebarNav';
import Topbar from '../../../components/layout/Topbar';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Stack, 
  Button, 
  Divider,
  Grid,
  Alert,
  Skeleton
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data, isLoading, error } = useQuery({ 
    queryKey: ['products'], 
    queryFn: getProducts 
  });

  const product = useMemo(() => {
    if (!data) return null;
    const items = Array.isArray(data) ? data : (data?.items ?? data ?? []);
    return items.find((p: any) => p.id === productId);
  }, [data, productId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, minHeight: '100vh' }}>
        <SidebarNav />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Topbar title="Product Details" />
          <Box component="main" sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="rectangular" height={100} />
              <Skeleton variant="rectangular" height={150} />
            </Stack>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, minHeight: '100vh' }}>
        <SidebarNav />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Topbar title="Product Details" />
          <Box component="main" sx={{ p: 3 }}>
            <Alert severity="error">
              Product not found or failed to load
            </Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <SidebarNav />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar title="Product Details" />
        <Box component="main" sx={{ p: 3, display: 'grid', gap: 3, overflow: 'auto', height: '100%' }}>
          
          {/* Back Button */}
          <Box>
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                Back to Products
              </Button>
            </Link>
          </Box>

          {/* Product Header */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4" component="h1" fontWeight={700}>
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                
                <Typography variant="h5" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
                  ₦{Number(product.price ?? 0).toLocaleString()}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description || 'No description available'}
                </Typography>

                <Stack direction="row" spacing={1}>
                  {product.category && (
                    <Chip label={product.category} size="small" variant="outlined" />
                  )}
                  {product.brand && (
                    <Chip label={product.brand} size="small" variant="outlined" />
                  )}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<Edit />} size="small">
                  Edit
                </Button>
                <Button variant="outlined" color="error" startIcon={<Delete />} size="small">
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Product Details Grid */}
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: 'fit-content' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">SKU</Typography>
                    <Typography variant="body1" fontWeight={500}>{product.sku}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{product.category || 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Brand</Typography>
                    <Typography variant="body1">{product.brand || 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Cost</Typography>
                    <Typography variant="body1">₦{Number(product.cost ?? 0).toLocaleString()}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Inventory Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: 'fit-content' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Inventory Status
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                    <Typography variant="h5" color="primary.main" fontWeight={700}>
                      {product.inventory?.quantity || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Reorder Point</Typography>
                    <Typography variant="body1">
                      {product.inventory?.reorderPoint || 'Not set'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1">
                      {product.inventory?.updatedAt ? 
                        new Date(product.inventory.updatedAt).toLocaleDateString() : 
                        'Never'
                      }
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* System Information */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  System Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Created</Typography>
                      <Typography variant="body1">
                        {product.createdAt ? 
                          new Date(product.createdAt).toLocaleDateString() : 
                          'Unknown'
                        }
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Last Modified</Typography>
                      <Typography variant="body1">
                        {product.updatedAt ? 
                          new Date(product.updatedAt).toLocaleDateString() : 
                          'Unknown'
                        }
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Typography variant="body1">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Product ID</Typography>
                      <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                        {product.id}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
} 