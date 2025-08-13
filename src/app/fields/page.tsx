"use client";

import SidebarNav from '../../components/layout/SidebarNav';
import Topbar from '../../components/layout/Topbar';
import { Box, Paper, Typography, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { Search } from 'lucide-react';
import FieldsTable from '../../components/fields/FieldsTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`fields-tabpanel-${index}`}
      aria-labelledby={`fields-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FieldsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '16rem 1fr' }, 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <SidebarNav />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar title="Fields" />
        <Box component="main" sx={{ p: 3, display: 'grid', gap: 3, overflow: 'auto', height: '100%' }}>
          {/* Tabs */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    minHeight: 56,
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              >
                <Tab label="Single fields" />
                <Tab label="Fields group" />
              </Tabs>
            </Box>

            {/* Search Bar */}
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                placeholder="Search in field names and internal names"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ color: 'text.secondary' }}>
                        <Search size={20} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '32%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Box>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
              <FieldsTable searchQuery={searchQuery} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Fields group functionality coming soon
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 