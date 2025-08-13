"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../lib/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { TableLoader } from '../ui/loading-spinner';

function ProductCard({ product, index }: { product: any; index: number }) {
  const active = !!product?.isActive;
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          border: "1px solid", 
          borderColor: "divider",
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(14, 165, 233, 0.05)',
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Number Badge */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </Box>
          
          {/* Product Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {product.sku}
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, mb: 1, fontWeight: 600 }} noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {product.description || 'No description available'}
                </Typography>
              </Box>
              <Chip
                size="small"
                variant="outlined"
                color={active ? "success" : "default"}
                label={active ? "Active" : "Inactive"}
                sx={{ flexShrink: 0 }}
              />
            </Stack>
            
            {/* Price and Category */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  ₦{Number(product.price ?? 0).toLocaleString()}
                </Typography>
                {product.category && (
                  <Chip 
                    label={product.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ mt: 0.5, fontSize: '0.75rem' }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Click to view details →
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Link>
  );
}

export default function ProductsView() {
  const { data, isLoading, error } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const [q, setQ] = useState("");

  const products = useMemo(() => {
    const items = Array.isArray(data) ? data : (data?.items ?? data ?? []);
    if (!q) return items;
    const qq = q.toLowerCase();
    return items.filter((p: any) => (p.name ?? "").toLowerCase().includes(qq) || (p.sku ?? "").toLowerCase().includes(qq));
  }, [data, q]);

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          placeholder="Search products by name or SKU"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ minWidth: 260, bgcolor: "background.paper" }}
        />
        <Link href="/inventory/product-create">
          <Button variant="contained" size="small">New Product</Button>
        </Link>
      </Stack>

      {isLoading ? (
        <TableLoader text="Loading products..." />
      ) : error ? (
        <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="error.main">Failed to load products</Typography>
        </Paper>
      ) : products.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No products yet. Create your first product.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {products.map((p: any, index: number) => (
            <ProductCard product={p} index={index} key={p.id} />
          ))}
        </Box>
      )}
    </Box>
  );
} 