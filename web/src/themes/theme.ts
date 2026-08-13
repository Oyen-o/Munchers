'use client';

import { createTheme } from '@mui/material/styles';
import { muiTypography } from './mui-typographgy';

declare module '@mui/material/styles' {
  interface Palette {
    stageIdea: Palette['primary'];
    stagePlanned: Palette['primary'];
  }
  interface PaletteOptions {
    stageIdea?: PaletteOptions['primary'];
    stagePlanned?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#333333',
      light: '#666666',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4a4a4a',
      light: '#7a7a7a',
      dark: '#1a1a1a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f8f8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#999999',
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
      main: '#FFB84D',
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
          fontSize: '1rem',
          borderRadius: 'var(--border-radius-md)',
          transition: 'var(--transition-base)',
          textTransform: 'none',
          fontWeight: 700,
          padding: 'var(--spacing-sm) var(--spacing-xl)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          backgroundColor: 'var(--color-orange-scarf)',
          color: 'var(--color-primary-contrast)',
          boxShadow: 'var(--shadow-sm)',
          '&:hover': {
            boxShadow: 'var(--shadow-md)',
          },
        },
          }
      },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'none',
          backgroundColor: 'var(--color-light-background-2)',
          border: "1px solid var(--color-orange-scarf)",
          margin: '4px',
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
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#999999',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-light-tan)',
            },
          },
        },
      },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        color: 'var(--color-dark-brown)',
        '&.MuiInput-root::after': {
          borderColor: 'var(--color-light-tan)',
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: 'var(--color-dark-brown)',
        '&.Mui-focused': {
          color: 'var(--color-dark-brown)',
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
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          color : 'var(--color-primary-contrast)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {

          minHeight: '20px',
          borderRadius: 'var(--border-radius-lg)',
          padding: '4px',
          margin: '0px 0px 0px 0px',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        },
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
          minHeight: '46px',

          borderRadius: 'var(--border-radius-lg)',
          backgroundColor: 'var(--color-light-background-1)',
          border: '1px solid var(--color-light-background-4)',
          '&:not(:last-child)': {
              marginRight: '6px',
          },
          '&:hover': {
            backgroundColor: '#e0e0e0',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-xl)',
          backgroundColor: 'var(--color-light-background-1)',
          border: '1px solid var(--color-light-background-4)',
          margin: '0px',
        }},
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 'var(--border-radius-lg)',
          backgroundColor: 'var(--color-light-background-1)',
          border: '1px solid var(--color-light-background-2)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'var(--color-primary-contrast)',
          textDecorationColor: 'currentColor',
          textUnderlineOffset: '2px',
          textDecorationThickness: '1px',
          transition: 'opacity var(--transition-fast)',
          '&:hover': {
            opacity: 1,
          },
          '&:focus-visible': {
            outline: '2px solid rgba(255, 255, 255, 0.8)',
            outlineOffset: '2px',
            borderRadius: '2px',
          },
        },
      },
    },
  },
});

export default theme;
