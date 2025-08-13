"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ProductCreateForm from '../../../components/product/ProductCreateForm';

export default function ProductCreatePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // Small timeout to allow dialog close animation before navigating
    setTimeout(() => {
      // Prefer going back; if no history, go to /products
      try { router.back(); } catch { router.push('/products'); }
    }, 150);
  };

  useEffect(() => { setOpen(true); }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Product</DialogTitle>
      <DialogContent>
        <ProductCreateForm />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 