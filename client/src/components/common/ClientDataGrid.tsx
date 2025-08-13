"use client";
import dynamic from 'next/dynamic';
import { DataGridProps } from '@mui/x-data-grid';

const DataGridNoSSR = dynamic(() => import('@mui/x-data-grid').then(m => m.DataGrid), {
  ssr: false,
});

interface ClientDataGridProps extends Omit<DataGridProps, 'sx'> {
  sx?: any;
}

export default function ClientDataGrid(props: ClientDataGridProps) {
  const { sx: userSx, ...rest } = props ?? {};
  const defaultSx = {
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: (theme: any) => theme.palette.action.hover,
      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0))',
      borderBottom: '1px solid',
      borderColor: 'divider',
    },
    // Space directly under the header border
    '& .MuiDataGrid-virtualScrollerContent': {
      paddingTop: (theme: any) => theme.spacing(0.95), // ~6px
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: 'text.secondary',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontSize: '0.72rem',
    },
    '& .MuiDataGrid-columnSeparator': {
      opacity: 0.15,
    },
    '& .MuiDataGrid-columnHeader': {
      outline: 'none !important',
    },
  } as const;

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <DataGridNoSSR
        density="compact"
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        disableColumnResize={true}
        pageSizeOptions={[25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        sx={[defaultSx, userSx]}
        {...rest}
      />
    </div>
  );
} 