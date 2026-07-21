'use client';

import { createTheme } from '@mui/material/styles';
import { muiTypography } from './mui-typographgy';

declare module '@mui/material/styles' {
  interface Palette {
    stageIdea: Palette['primary'];
    stagePicked: Palette['primary'];
    stagePlanned: Palette['primary'];
  }
  interface PaletteOptions {
    stageIdea?: PaletteOptions['primary'];
    stagePicked?: PaletteOptions['primary'];
    stagePlanned?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#cbd5e1',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    stageIdea: {
      main: '#f59e0b',
    },
    stagePicked: {
      main: '#3b82f6',
    },
    stagePlanned: {
      main: '#10b981',
    },
  },
...muiTypography,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-md)',
          transition: 'var(--transition-base)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-md)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--border-radius-md)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-md)',
          width: '100px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'unset',
          padding: '4px',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        },
        flexContainer: {
          gap: '8px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 'var(--font-size-base)',
          minHeight: 'unset',
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--color-text-secondary)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#cbd5e1',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--color-light-background-1)',
            color: 'var(--color-text-primary)',
            fontWeight: 600,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiTab-iconWrapper': {
        
            marginBottom: '0 !important',
          },
        },
      },
    },
  },
});

export default theme;
