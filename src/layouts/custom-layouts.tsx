// src/CustomLayout.tsx
import * as React from 'react';
import { AppLayout } from '@toolpad/core/AppLayout';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function CustomLayout() {
  return (
    <AppLayout>
      <Box sx={{ padding: 2 }}>
        {/* This skips the PageContainer that includes breadcrumbs */}
        <Outlet />
      </Box>
    </AppLayout>
  );
}