"use client";

import SidebarNav from '../../components/layout/SidebarNav';
import Topbar from '../../components/layout/Topbar';
import ProductsView from '../../components/products/ProductsView';
import { Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ProductCreateForm from '../../components/product/ProductCreateForm';
import { useState } from 'react';

export default function ProductsPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <SidebarNav />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar title="Products" onActionClick={() => setOpen(true)} />
        <Box component="main" sx={{ p: 2, overflow: 'auto', height: '100%' }}>
          <ProductsView />
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' } }}
        PaperProps={{ sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2 } }}
      >
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <ProductCreateForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
} 