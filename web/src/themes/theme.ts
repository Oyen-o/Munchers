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
      main: '#8B7FD6',
      light: '#A99EE6',
      dark: '#6B5FBF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B794F6',
      light: '#C8A9F9',
      dark: '#9B7AE8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#E8E5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D2640',
      secondary: '#6B5F8F',
      disabled: '#B8B0D0',
    },
    success: {
      main: '#6BCF9C',
    },
    warning: {
      main: '#FFB84D',
    },
    error: {
      main: '#FF7B7B',
    },
    info: {
      main: '#8B7FD6',
    },
    stageIdea: {
      main: '#FFB84D',
    },
    stagePicked: {
      main: '#8B7FD6',
    },
    stagePlanned: {
      main: '#6BCF9C',
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
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E8E5F7',
            },
            '&:hover fieldset': {
              borderColor: '#A99EE6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B7FD6',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-sm)',
          width: '124px',
          fontWeight: 600,
          padding: '4px 12px',
          color : 'var(--color-primary-contrast)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-light-background-1)',
          minHeight: '20px',
          borderRadius: 'var(--border-radius-lg)',
          padding: '4px',
          margin: '0px 0px 0px 0px',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        },
        flexContainer: {
          gap: '2px',
        },
      },
    },
    MuiTabList: {
      styleOverrides: {
        root: { },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          margin: '0 !important',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          height: '20px',
          minHeight: '46px',
          padding: '4px 0px',
          borderRadius: 'var(--border-radius-lg)',
          backgroundColor: 'var(--color-light-background-1)',
          '&:not(:last-child)': {
              marginRight: '6px',
          },
          '&:hover': {
            backgroundColor: '#D8D4EC',
          },
          '&.Mui-selected': { 
            backgroundColor: 'var(--color-light-background-3)',
            color: 'var(--color-primary-dark)',

            cursor: 'default',
          },
          '&.MuiTab-iconWrapper': {
            marginRight: '8px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 'var(--border-radius-xl)',
          boxShadow: 'var(--shadow-xl)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)',
          '&:hover': {
            backgroundColor: 'rgba(139, 127, 214, 0.08)',
          },
        },
      },
    },
  },
});

export default theme;
