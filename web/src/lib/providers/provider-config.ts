export type ExperienceProvider = 'meetup' | 'partiful' | 'sweatpals';

export interface ProviderColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ProviderConfig {
  name: string;
  logo: string;
  colors: ProviderColors;
  displayName: string;
}

export const providerConfig: Record<ExperienceProvider, ProviderConfig> = {
  meetup: {
    name: "Meetup",
    displayName: "Meetup",
    logo: "/logos/meetup.png",
    colors: {
      primary: "#E6194B",
      secondary: "#F37B96",
      accent: "#B1123B",
      background: "#FFF1F4",
    },
  },
  partiful: {
    name: "Partiful",
    displayName: "Partiful",
    logo: "/logos/partiful.jpg",
    colors: {
      primary: "#E9E8F5",
      secondary: "#C8B8F8",
      accent: "#8E79F7",
      background: "#0F0C16",
    },
  },
  sweatpals: {
    name: "SweatPals",
    displayName: "SweatPals",
    logo: "/logos/sweat-pals.jpg",
    colors: {
      primary: "#D25EF0",
      secondary: "#D0F44D",
      accent: "#000000",
      background: "#F8F8F8",
    },
  },
};

export function getProviderConfig(
  provider?: ExperienceProvider,
): ProviderConfig | null {
  if (!provider) return null;
  return providerConfig[provider] || null;
}
