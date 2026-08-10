import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { ExternalProviderBadge } from '../external-provider-badge';
import {
  getProviderConfig,
  type ExperienceProvider,
} from '../../lib/providers/provider-config';
import './experience-item.scss';

export interface Experience {
  id: string;
  title: string;
  category: string;
  date: string;
  coverImage: string;
  badge?: string;
  logoUrl?: string;
  brandId?: string;
  provider?: ExperienceProvider;
  externalUrl?: string;
}

export interface ExperienceItemProps {
  experience: Experience;
  variant?: 'default' | 'official' | 'compact';
  onBrandClick?: (brandId: string) => void;
  onExternalClick?: (url: string) => void;
  onClick?: () => void;
}

export function ExperienceItem({
  experience,
  variant = 'default',
  onBrandClick,
  onExternalClick,
  onClick,
}: ExperienceItemProps) {
  const providerConfig = getProviderConfig(experience.provider);
  const hasProvider = !!experience.provider;
  const isOfficial = variant === 'official';
  const isMeetup = experience.category === 'Meetup';

  const handleBrandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (experience.brandId && onBrandClick) {
      onBrandClick(experience.brandId);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (experience.externalUrl && onExternalClick) {
      onExternalClick(experience.externalUrl);
    }
  };

  // Dynamic CSS variables for provider colors
  const providerStyles = providerConfig
    ? {
        '--provider-primary': providerConfig.colors.primary,
        '--provider-secondary': providerConfig.colors.secondary,
        '--provider-accent': providerConfig.colors.accent,
        '--provider-background': providerConfig.colors.background,
        '--provider-primary-40': `${providerConfig.colors.primary}40`,
      }
    : {};

  return (
    <Card
      className={`experience-item ${isOfficial ? 'experience-item--official' : ''} ${
        hasProvider ? 'experience-item--external' : ''
      } ${variant === 'compact' ? 'experience-item--compact' : ''}`}
      onClick={onClick}
      style={providerStyles as React.CSSProperties}
    >
      <div className="experience-item__media">
        <CardMedia
          component="img"
          image={experience.coverImage}
          alt={experience.title}
          className="experience-item__image"
        />

        {/* Brand Logo for Official Experiences */}
        {experience.logoUrl && experience.brandId && !hasProvider && (
          <div className="experience-item__badge">
            <div
              className="experience-item__brand-logo"
              onClick={handleBrandClick}
              title="View brand page"
            >
              <img src={experience.logoUrl} alt="Brand logo" />
            </div>
          </div>
        )}

        {/* Provider Badge for External Events */}
        {experience.provider && (
          <div className="experience-item__badge">
            <ExternalProviderBadge
              provider={experience.provider}
              size="medium"
              onClick={experience.externalUrl ? handleExternalClick : undefined}
            />
          </div>
        )}

        {/* Legacy Meetup Badge (backward compatibility) */}
        {isMeetup && !experience.provider && (
          <div className="experience-item__legacy-badge">MEET-UP</div>
        )}

        {/* Overlay with Title and Official Badge */}
        <div className="experience-item__overlay">
          {isOfficial && experience.badge && (
            <Typography
              component="div"
              className="experience-item__official-badge"
            >
              {experience.badge}
            </Typography>
          )}
          <Typography component="h6" className="experience-item__title">
            {experience.title}
          </Typography>
        </div>
      </div>

      <CardContent className="experience-item__content">
        {/* Category */}
        <Typography
          variant="caption"
          className={`experience-item__category ${
            isOfficial
              ? 'experience-item__category--official'
              : hasProvider
                ? 'experience-item__category--external'
                : 'experience-item__category--native'
          }`}
        >
          {experience.category}
        </Typography>

        {/* Date */}
        <Typography variant="body2" className="experience-item__date">
          {experience.date}
        </Typography>

        {/* Provider Chip */}
        {hasProvider && providerConfig && (
          <Chip
            onClick={handleExternalClick}
            icon={<OpenInNewIcon />}
            label={providerConfig.displayName}
            size="small"
            className="experience-item__provider-chip"
          />
        )}
      </CardContent>
    </Card>
  );
}
