"use client";

import SidebarNav from '../../components/layout/SidebarNav';
import Topbar from '../../components/layout/Topbar';
import InventoryActions from '../../components/inventory/InventoryActions';
import InventoryTable from '../../components/inventory/InventoryTable';
import { Box, Paper, Button } from '@mui/material';
import { useState } from 'react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockinOpen, setStockinOpen] = useState(false);
  const [stockoutOpen, setStockoutOpen] = useState(false);
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <SidebarNav />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar title="Inventory" />
        <Box component="main" sx={{ p: 2, display: 'grid', gap: 2, overflow: 'auto', height: '100%' }}>
          <Paper elevation={0} sx={{ p: 2, border: 'none' }}>
            <InventoryActions
              search={search}
              onSearchChange={setSearch}
              lowStockOnly={lowStockOnly}
              onLowStockChange={setLowStockOnly}
            />
          </Paper>
          <Paper elevation={0} sx={{ p: 2, border: 'none' }}>
            <InventoryTable />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 