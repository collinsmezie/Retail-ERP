"use client";

import { Box, Paper, Typography, Button } from '@mui/material';
import { ShoppingCart, TrendingUp, Users, CreditCard, Receipt } from 'lucide-react';
import Link from 'next/link';
import SidebarNav from '../../components/layout/SidebarNav';
import Topbar from '../../components/layout/Topbar';

export default function SalesPage() {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <Topbar title="Sales Management" />

        {/* Coming Soon Content */}
        <Box component="main" sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
          <Paper elevation={0} sx={{ p: 6, border: '1px solid', borderColor: 'divider', maxWidth: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {/* Main Icon */}
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: 'primary.50', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'primary.main'
              }}>
                <ShoppingCart size={40} />
              </Box>

              {/* Title */}
              <Typography variant="h4" fontWeight={600} color="text.primary">
                Coming Soon!
              </Typography>

              {/* Description */}
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                We're working hard to bring you a comprehensive sales management system. 
                This feature will include order processing, customer management, and detailed analytics.
              </Typography>

              {/* Feature Preview */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <TrendingUp size={20} color="#0EA5E9" />
                  <Typography variant="body2" fontWeight={500}>Sales Analytics</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Users size={20} color="#0EA5E9" />
                  <Typography variant="body2" fontWeight={500}>Customer Management</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <CreditCard size={20} color="#0EA5E9" />
                  <Typography variant="body2" fontWeight={500}>Payment Processing</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Receipt size={20} color="#0EA5E9" />
                  <Typography variant="body2" fontWeight={500}>Order Management</Typography>
                </Box>
              </Box>

              {/* Action Button */}
              <Link href="/" style={{ textDecoration: 'none', marginTop: 2 }}>
                <Button variant="contained" size="large">
                  Back to Dashboard
                </Button>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 