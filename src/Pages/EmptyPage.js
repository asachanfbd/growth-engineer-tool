import React from 'react';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

function EmptyPage({ pageName='' }) {

  const EmptyPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
  }));

return (
  <div className="container">
    <EmptyPaper elevation={0}>
      {pageName} Page Coming Soon!!
    </EmptyPaper>
  </div>
);
}

export default EmptyPage;