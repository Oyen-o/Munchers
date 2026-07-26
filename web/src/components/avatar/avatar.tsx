import { Box } from '@mui/material';

type Size = 'small' | 'medium' | 'large';

export function Avatar({ src, alt, size = 'medium', user }: { src: string; alt: string; size?: Size; user?: any }) {
    const border = size === 'small' ? '1px solid var(--color-accent-main)' : size === 'medium' ? '2px solid var(--color-accent-main)' : '3px solid var(--color-accent-main)';
    const dimensions = size === 'small' ? 25 : size === 'medium' ? 45 : 55;
  return (
    <Box sx={{ border, cursor: 'pointer', borderRadius: '50%', height: dimensions, width: dimensions, backgroundImage: `url(${src})`, backgroundSize: 'cover' }} />
  );
}