"use client";

import Link from 'next/link';
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InventoryIcon from '@mui/icons-material/Inventory2';
import BuildIcon from '@mui/icons-material/Build';

export default function SidebarNav() {
  return (
    <Box component="aside" sx={{ 
      display: { xs: 'none', md: 'block' }, 
      borderRight: '1px solid', 
      borderColor: 'divider', 
      bgcolor: 'background.paper',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Box sx={{ height: 56, display: 'flex', alignItems: 'center', px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>Retail ERP</Typography>
      </Box>
      <List dense>
        <ListItemButton component={Link} href="/">
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
        <ListItemButton component={Link} href="/fields">
          <ListItemIcon><BuildIcon fontSize="small"/></ListItemIcon>
          <ListItemText primary="Fields" />
        </ListItemButton>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button component={Link} href="/inventory/product-create" fullWidth variant="outlined" size="small">New Product</Button>
      </Box>
    </Box>
  );
} 