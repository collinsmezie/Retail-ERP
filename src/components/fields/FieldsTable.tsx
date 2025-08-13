"use client";

import { useState, useMemo } from 'react';
import { Box, Paper, Typography, Chip, TablePagination } from '@mui/material';
import ClientDataGrid from '../common/ClientDataGrid';

interface Field {
  id: string;
  fieldName: string;
  internalName: string;
  fieldType: string;
  createdOn: string;
  lastModified: string;
  usedInForms: number;
  numberOfValues: number | string;
}

// Mock data for demonstration
const mockFields: Field[] = [
  {
    id: '1',
    fieldName: 'Full name (En)',
    internalName: 'Full name (En)',
    fieldType: 'Single line',
    createdOn: 'April 11, 2023 16:10 PM',
    lastModified: 'April 17, 2023 16:10 PM',
    usedInForms: 2,
    numberOfValues: 'N/A'
  },
  {
    id: '2',
    fieldName: 'Full name (Ar)',
    internalName: 'Full name (Ar)',
    fieldType: 'Single line',
    createdOn: 'April 11, 2023 15:13 PM',
    lastModified: 'April 11, 2023 15:13 PM',
    usedInForms: 7,
    numberOfValues: 'N/A'
  },
  {
    id: '3',
    fieldName: 'Email',
    internalName: 'User email',
    fieldType: 'Single line',
    createdOn: 'April 11, 2023 12:40 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 3,
    numberOfValues: 'N/A'
  },
  {
    id: '4',
    fieldName: 'Profile image',
    internalName: 'User profile image',
    fieldType: 'File upload',
    createdOn: 'April 11, 2023 12:40 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 1,
    numberOfValues: 'N/A'
  },
  {
    id: '5',
    fieldName: 'Direct manager',
    internalName: 'Direct manager',
    fieldType: 'Single line',
    createdOn: 'April 9, 2023 17:45 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 8,
    numberOfValues: 'N/A'
  },
  {
    id: '6',
    fieldName: 'Phone number',
    internalName: 'User phone number',
    fieldType: 'Single line',
    createdOn: 'April 9, 2023 12:32 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 3,
    numberOfValues: 'N/A'
  },
  {
    id: '7',
    fieldName: 'Position',
    internalName: 'Position',
    fieldType: 'Dropdown',
    createdOn: 'April 8, 2023 11:21 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 5,
    numberOfValues: 32
  },
  {
    id: '8',
    fieldName: 'Group type',
    internalName: 'Group type',
    fieldType: 'Single line',
    createdOn: 'April 7, 2023 09:40 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 3,
    numberOfValues: 'N/A'
  },
  {
    id: '9',
    fieldName: 'Group name',
    internalName: 'Group name',
    fieldType: 'Single line',
    createdOn: 'April 8, 2023 13:02 PM',
    lastModified: 'April 11, 2023 12:40 PM',
    usedInForms: 7,
    numberOfValues: 'N/A'
  },
  {
    id: '10',
    fieldName: 'Group manager',
    internalName: 'Group manager',
    fieldType: 'Single line',
    createdOn: 'April 3, 2023 10:27 PM',
    lastModified: 'April 3, 2023 10:27 PM',
    usedInForms: 5,
    numberOfValues: 'N/A'
  }
];

interface FieldsTableProps {
  searchQuery: string;
}

export default function FieldsTable({ searchQuery }: FieldsTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return mockFields;
    
    const query = searchQuery.toLowerCase();
    return mockFields.filter(field => 
      field.fieldName.toLowerCase().includes(query) ||
      field.internalName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const columns = [
    { 
      field: 'fieldName', 
      headerName: 'Field name', 
      flex: 1.5, 
      minWidth: 200,
      renderCell: (params: any) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'internalName', 
      headerName: 'Internal name', 
      flex: 1.5, 
      minWidth: 200,
      renderCell: (params: any) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'fieldType', 
      headerName: 'Field type', 
      width: 150,
      renderCell: (params: any) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          sx={{ 
            borderColor: 'primary.main',
            color: 'primary.main',
            fontWeight: 500
          }}
        />
      )
    },
    { 
      field: 'createdOn', 
      headerName: 'Created on', 
      width: 180,
      renderCell: (params: any) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'lastModified', 
      headerName: 'Last modified on', 
      width: 180,
      renderCell: (params: any) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'usedInForms', 
      headerName: 'Used in forms', 
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'numberOfValues', 
      headerName: '# of values', 
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    }
  ];

  const paginatedFields = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredFields.slice(start, end);
  }, [filteredFields, page, pageSize]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Total count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total number: {filteredFields.length}
        </Typography>
      </Box>

      {/* Data Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <ClientDataGrid
          rows={paginatedFields}
          columns={columns}
          hideFooterPagination
          hideFooter
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
              }
            }
          }}
        />
      </Paper>

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, filteredFields.length)} of {filteredFields.length} entries
        </Typography>
        <TablePagination
          component="div"
          count={filteredFields.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="per page"
        />
      </Box>
    </Box>
  );
} 