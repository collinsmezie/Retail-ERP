"use client";

import { AppBar, Toolbar, Typography, Box, Paper, Button, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { LayoutDashboard, Package, ShoppingCart, Banknote, Boxes, Plus } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getInventory, getProducts } from '../lib/api';
import { TableLoader } from '../components/ui/loading-spinner';

function StatCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.3 }}>{title}</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography>
      {hint && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{hint}</Typography>}
    </Paper>
  );
}

export default function HomePage() {
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({ 
    queryKey: ['inventory'], 
    queryFn: getInventory 
  });
  
  const { data: productsData, isLoading: productsLoading } = useQuery({ 
    queryKey: ['products'], 
    queryFn: getProducts 
  });

  const isLoading = inventoryLoading || productsLoading;

  // Calculate stats from data
  const totalProducts = productsData ? (Array.isArray(productsData) ? productsData.length : (productsData?.items?.length || 0)) : 0;
  const lowStockCount = inventoryData ? (Array.isArray(inventoryData) ? inventoryData.filter((item: any) => item.lowStock).length : (inventoryData?.items?.filter((item: any) => item.lowStock).length || 0)) : 0;

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Box component="aside" sx={{ 
        display: { xs: 'none', md: 'block' }, 
        borderRight: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}>
        <Box sx={{ height: 56, display: 'flex', alignItems: 'center', px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600}>Retail ERP</Typography>
        </Box>
        <List dense>
          <ListItemButton component={Link} href="/" selected>
            <ListItemIcon><LayoutDashboard size={20}/></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} href="/products">
            <ListItemIcon><Package size={20}/></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
          <ListItemButton component={Link} href="/sales">
            <ListItemIcon><ShoppingCart size={20}/></ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItemButton>
          <ListItemButton component={Link} href="/accounting">
            <ListItemIcon><Banknote size={20}/></ListItemIcon>
            <ListItemText primary="Accounting" />
          </ListItemButton>
          <ListItemButton component={Link} href="/inventory">
            <ListItemIcon><Boxes size={20}/></ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="outlined" size="small" startIcon={<Plus size={16}/>}>New Product</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1" fontWeight={600}>Dashboard</Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Link href="/inventory/product-create"><Button variant="contained" size="small" startIcon={<Plus size={16}/>}>New Product</Button></Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: 2, display: 'grid', gap: 2, overflow: 'auto', height: '100%' }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
            gap: 2 
          }}>
            {isLoading ? (
              <>
                <StatCard title="Total Products" value="..." hint="Loading..."/>
                <StatCard title="Stock Value" value="..." hint="Loading..."/>
                <StatCard title="Low Stock" value="..." hint="Loading..."/>
                <StatCard title="Today's Sales" value="..." hint="Loading..."/>
              </>
            ) : (
              <>
                <StatCard title="Total Products" value={totalProducts.toString()} hint="Active in catalog"/>
                <StatCard title="Stock Value" value="₦3.2m" hint="Estimated retail"/>
                <StatCard title="Low Stock" value={lowStockCount.toString()} hint="Below reorder point"/>
                <StatCard title="Today's Sales" value="₦82k" hint="Across all channels"/>
              </>
            )}
          </Box>

          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Link href="/inventory"><Button size="small" variant="outlined" startIcon={<Boxes size={16}/>}>Inventory</Button></Link>
              <Link href="/products"><Button size="small" variant="outlined" startIcon={<Package size={16}/>}>Products</Button></Link>
              <Link href="/sales"><Button size="small" variant="outlined" startIcon={<ShoppingCart size={16}/>}>Sales</Button></Link>
              <Link href="/accounting"><Button size="small" variant="outlined" startIcon={<Banknote size={16}/>}>Accounting</Button></Link>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
