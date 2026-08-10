import { Box } from '@mui/material';
import {
  getProviderConfig,
  type ExperienceProvider,
} from '../../lib/providers/provider-config';

interface ExternalProviderBadgeProps {
  provider: ExperienceProvider;
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent) => void;
}

export function ExternalProviderBadge({
  provider,
  size = 'medium',
  onClick,
}: ExternalProviderBadgeProps) {
  const config = getProviderConfig(provider);

  if (!config) return null;

  const sizeMap = {
    small: { logo: 32, padding: '6px' },
    medium: { logo: 48, padding: '10px' },
    large: { logo: 64, padding: '12px' },
  };

  const { logo, padding } = sizeMap[size];

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: config.colors.background,
        padding,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        boxShadow: `0 2px 8px ${config.colors.primary}20`,
        border: `2px solid ${config.colors.primary}40`,
        ...(onClick && {
          '&:hover': {
            transform: 'scale(1.08)',
            backgroundColor: config.colors.background,
            boxShadow: `0 4px 16px ${config.colors.primary}40`,
            borderColor: config.colors.primary,
          },
          '&:active': {
            transform: 'scale(1.02)',
          },
        }),
      }}
      title={`Hosted on ${config.displayName}`}
    >
      <img
        src={config.logo}
        alt={`${config.displayName} logo`}
        style={{
          width: logo,
          height: logo,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
