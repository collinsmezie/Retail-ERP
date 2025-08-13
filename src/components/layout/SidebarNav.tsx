"use client";

import Link from 'next/link';
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { LayoutDashboard, Package, ShoppingCart, Banknote, Boxes, Settings, Plus } from 'lucide-react';

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
        <ListItemButton component={Link} href="/fields">
          <ListItemIcon><Settings size={20}/></ListItemIcon>
          <ListItemText primary="Fields" />
        </ListItemButton>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button component={Link} href="/inventory/product-create" fullWidth variant="outlined" size="small" startIcon={<Plus size={16}/>}>New Product</Button>
      </Box>
    </Box>
  );
} 