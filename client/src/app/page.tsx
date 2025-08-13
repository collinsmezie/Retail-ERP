"use client";

import { AppBar, Toolbar, Typography, Box, Paper, Grid, Button, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import Link from 'next/link';

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
            <ListItemIcon><DashboardIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} href="/products">
            <ListItemIcon><CategoryIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
          <ListItemButton component={Link} href="/sales">
            <ListItemIcon><ShoppingCartIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItemButton>
          <ListItemButton component={Link} href="/accounting">
            <ListItemIcon><AccountBalanceIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Accounting" />
          </ListItemButton>
          <ListItemButton component={Link} href="/inventory">
            <ListItemIcon><InventoryIcon fontSize="small"/></ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="outlined" size="small">New Product</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1" fontWeight={600}>Dashboard</Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Link href="/inventory/product-create"><Button variant="contained" size="small">New Product</Button></Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: 2, display: 'grid', gap: 2, overflow: 'auto', height: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Products" value="236" hint="Active in catalog"/></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Stock Value" value="₦3.2m" hint="Estimated retail"/></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Low Stock" value="18" hint="Below reorder point"/></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Today’s Sales" value="₦82k" hint="Across all channels"/></Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Link href="/inventory"><Button size="small" variant="outlined">Inventory</Button></Link>
              <Link href="/products"><Button size="small" variant="outlined">Products</Button></Link>
              <Link href="/sales"><Button size="small" variant="outlined">Sales</Button></Link>
              <Link href="/accounting"><Button size="small" variant="outlined">Accounting</Button></Link>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
