'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  BookmarkBorder as SaveIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as VerifyIcon,
  Groups2 as GroupsIcon,
  LocalDining as DiningIcon,
  Search as SearchIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import './entities-mock.scss';

type Restaurant = {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  neighborhood: string;
  address: string;
  hours: string;
  cover: string;
  photo: string;
  map: string;
  rating: number;
  recommendationCount: number;
  plans: number;
  dishes: string[];
};

const restaurants: Restaurant[] = [
  {
    id: 'joe-pizza',
    name: "Joe's Pizza",
    category: 'Dinner',
    cuisine: 'New York Style Pizza',
    neighborhood: 'North End',
    address: '14 Prince St, Boston, MA',
    hours: 'Open now · Closes 11:00 PM',
    cover:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80',
    photo:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
    rating: 4.8,
    recommendationCount: 18,
    plans: 5,
    dishes: ['Vodka Slice', 'Burrata Pie', 'Garlic Knots'],
  },
  {
    id: 'harbor-cafe',
    name: 'Harbor Cafe',
    category: 'Breakfast',
    cuisine: 'Coastal Brunch',
    neighborhood: 'Seaport',
    address: '92 Harbor Walk, Boston, MA',
    hours: 'Open now · Closes 3:00 PM',
    cover:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
    photo:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    map: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&q=80',
    rating: 4.7,
    recommendationCount: 13,
    plans: 3,
    dishes: ['Lobster Benedict', 'Honey Biscuit Stack', 'Cold Brew Float'],
  },
  {
    id: 'bluebird-coffee',
    name: 'Bluebird Coffee',
    category: 'Coffee',
    cuisine: 'Specialty Coffee',
    neighborhood: 'Back Bay',
    address: '201 Dartmouth St, Boston, MA',
    hours: 'Open now · Closes 8:00 PM',
    cover:
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80',
    photo:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    map: 'https://images.unsplash.com/photo-1470480562947-7b9e08bb7f58?w=800&q=80',
    rating: 4.6,
    recommendationCount: 22,
    plans: 2,
    dishes: ['Maple Oat Latte', 'Cardamom Bun', 'Yuzu Tonic Espresso'],
  },
  {
    id: 'riverside-tacos',
    name: 'Riverside Tacos',
    category: 'Lunch',
    cuisine: 'Street Tacos',
    neighborhood: 'Cambridgeport',
    address: '77 River St, Cambridge, MA',
    hours: 'Open now · Closes 9:30 PM',
    cover:
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1200&q=80',
    photo:
      'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80',
    map: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    rating: 4.5,
    recommendationCount: 16,
    plans: 4,
    dishes: ['Al Pastor Trio', 'Roasted Corn Elote', 'Horchata Slush'],
  },
];

const friendAvatars = [
  'https://i.pravatar.cc/64?img=12',
  'https://i.pravatar.cc/64?img=22',
  'https://i.pravatar.cc/64?img=31',
  'https://i.pravatar.cc/64?img=47',
];

function ScreenBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="entities-mock__screen">
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" className="entities-mock__subtitle">
          {subtitle}
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card className="entities-mock__restaurant-card">
      <Box
        className="entities-mock__restaurant-hero"
        sx={{ backgroundImage: `url(${restaurant.cover})` }}
      >
        <Chip size="small" label={`${restaurant.plans} upcoming`} />
      </Box>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {restaurant.name}
          </Typography>
          <IconButton size="small">
            <SaveIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" className="entities-mock__muted">
          {restaurant.category} · {restaurant.neighborhood}
        </Typography>
        <Stack direction="row" spacing={1.25} sx={{ mt: 1 }}>
          <Chip size="small" icon={<StarIcon />} label={restaurant.rating} />
          <Chip
            size="small"
            icon={<GroupsIcon />}
            label={`${restaurant.recommendationCount} recs`}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1.25 }}
        >
          <AvatarGroup max={3}>
            {friendAvatars.map((avatar) => (
              <Avatar key={avatar} src={avatar} sx={{ width: 24, height: 24 }} />
            ))}
          </AvatarGroup>
          <Typography variant="caption" className="entities-mock__muted">
            4 friends have been here
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function EntitiesMockPage() {
  const [groupTab, setGroupTab] = useState(0);

  return (
    <Box className="entities-mock">
      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Local Food Social Mockups
        </Typography>
        <Typography className="entities-mock__subtitle">
          Production-quality, UI-only concept pages for community discovery around neighborhood favorites.
        </Typography>
      </Stack>

      <ScreenBlock
        title="1) Discover"
        subtitle="Browse nearby places recommended by communities."
      >
        <TextField
          fullWidth
          placeholder="Search restaurants, cafes, tacos, bakeries..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          {[
            'Breakfast',
            'Coffee',
            'Lunch',
            'Dinner',
            'Dessert',
            'Drinks',
            'Outdoor Seating',
          ].map((cat) => (
            <Chip key={cat} label={cat} variant="outlined" />
          ))}
        </Stack>

        {[
          'Trending This Week',
          'Popular Among Your Groups',
          'Recently Added',
          'Near You',
        ].map((section) => (
          <Box key={section} sx={{ mt: 2.25 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              {section}
            </Typography>
            <Box className="entities-mock__carousel">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={`${section}-${restaurant.id}`} restaurant={restaurant} />
              ))}
            </Box>
          </Box>
        ))}
      </ScreenBlock>

      <ScreenBlock
        title="2) Entity Detail"
        subtitle="Single destination page for a local restaurant."
      >
        <Box
          className="entities-mock__detail-hero"
          sx={{ backgroundImage: `url(${restaurants[0].cover})` }}
        />
        <Stack direction="row" spacing={1.25} sx={{ mt: 1.5 }} alignItems="center">
          <Avatar src={restaurants[0].photo} sx={{ width: 56, height: 56 }} />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {restaurants[0].name}
              </Typography>
              <VerifyIcon sx={{ color: 'var(--color-success-main)' }} />
            </Stack>
            <Typography className="entities-mock__muted">
              {restaurants[0].cuisine} · {restaurants[0].address}
            </Typography>
            <Typography className="entities-mock__muted">
              {restaurants[0].hours} · Community rating {restaurants[0].rating}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button variant="contained">Create Plan</Button>
          <Button variant="outlined" startIcon={<SaveIcon />}>
            Save
          </Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          About
        </Typography>
        <Typography variant="body2" className="entities-mock__muted">
          A neighborhood pizza shop with late-night slices, local craft soda, and a patio that fills up after Red Sox games.
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 2 }}>
          Community Stats
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
          <Chip label="Recommended by 18 people" />
          <Chip label="Saved by 6 groups" />
          <Chip label="42 completed meetups" />
        </Stack>

        <Stack spacing={0.75} sx={{ mt: 2 }}>
          {[
            'Upcoming Plans',
            'Recent Meetups',
            'Community Photos',
            'Recommendations',
            'Groups that love this place',
          ].map((row) => (
            <Typography key={row} variant="body2">
              • {row}
            </Typography>
          ))}
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="3) Create Plan"
        subtitle="Plan creator with preselected entity and local context preview."
      >
        <Stack spacing={1.25}>
          <TextField label="Restaurant" value="Joe's Pizza" disabled />
          <TextField label="Plan title" placeholder="Friday Slice Run" />
          <Stack direction="row" spacing={1.25}>
            <TextField
              type="date"
              label="Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="Time"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <TextField label="Invite group" placeholder="Boston Foodies" />
          <TextField
            label="Notes"
            multiline
            minRows={2}
            placeholder="Try the burrata pie first, then share plates."
          />
          <Card variant="outlined" className="entities-mock__preview-card">
            <Stack direction="row" spacing={1.25}>
              <Box
                className="entities-mock__preview-photo"
                sx={{ backgroundImage: `url(${restaurants[0].photo})` }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {restaurants[0].name}
                </Typography>
                <Typography variant="caption" className="entities-mock__muted">
                  {restaurants[0].address}
                </Typography>
                <Box
                  className="entities-mock__preview-map"
                  sx={{ backgroundImage: `url(${restaurants[0].map})` }}
                />
              </Box>
            </Stack>
          </Card>
          <Button variant="contained">Create Plan</Button>
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="4) Group Page"
        subtitle="Community group with food-first tabs and favorite place pins."
      >
        <Box className="entities-mock__group-cover" />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1.25 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Boston Foodies
            </Typography>
            <Typography className="entities-mock__muted">
              Weekly dinners, brunch crawls, and spontaneous taco nights.
            </Typography>
            <Typography variant="caption" className="entities-mock__muted">
              214 members
            </Typography>
          </Box>
          <Button variant="contained">Join</Button>
        </Stack>

        <Tabs
          value={groupTab}
          onChange={(_, value) => setGroupTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mt: 1 }}
        >
          <Tab label="Upcoming Plans" />
          <Tab label="Past Plans" />
          <Tab label="Favorite Places" />
          <Tab label="Recommendations" />
        </Tabs>
        <Box className="entities-mock__grid" sx={{ mt: 1.25 }}>
          {restaurants.slice(0, 3).map((restaurant) => (
            <RestaurantCard key={`group-${restaurant.id}`} restaurant={restaurant} />
          ))}
        </Box>
      </ScreenBlock>

      <ScreenBlock
        title="5) User Profile"
        subtitle="Food history and social planning footprint."
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar src={friendAvatars[0]} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Carina M.
            </Typography>
            <Typography className="entities-mock__muted">
              Back Bay · Loves neighborhood bakeries and espresso bars
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <Chip label="Places visited: 52" />
          <Chip label="Restaurants recommended: 19" />
          <Chip label="Plans attended: 37" />
        </Stack>
        <Stack spacing={0.6} sx={{ mt: 1.5 }}>
          {[
            'Favorite Restaurants',
            'Recently Visited',
            'Upcoming Plans',
            'Groups',
            'Recent Recommendations',
          ].map((item) => (
            <Typography key={item} variant="body2">
              • {item}
            </Typography>
          ))}
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="6) Recommendation Feed"
        subtitle="Community-first feed around food discovery and social activity."
      >
        <Stack spacing={1.1}>
          {[
            'Sarah recommended Bluebird Coffee for early meetings',
            'Boston Foodies planned dinner at Harbor Cafe',
            'Mike visited Riverside Tacos and posted 3 photos',
            'Emily saved Corner Bakery to Brunch list',
            "Joe's Pizza is now trending among your friends",
          ].map((activity, index) => (
            <Stack key={activity} direction="row" spacing={1.25} alignItems="center">
              <Avatar src={friendAvatars[index % friendAvatars.length]} sx={{ width: 30, height: 30 }} />
              <Typography variant="body2">{activity}</Typography>
            </Stack>
          ))}
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="7) Search"
        subtitle="Unified search grouped by restaurants, groups, and people."
      >
        <TextField
          fullWidth
          placeholder="Search places, groups, people"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {['Restaurants', 'Groups', 'People', 'Recent Searches', 'Popular Nearby'].map((section) => (
          <Box key={section} sx={{ mt: 1.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
              {section}
            </Typography>
            <Typography variant="body2" className="entities-mock__muted">
              {section === 'Restaurants'
                ? "Joe's Pizza · Harbor Cafe · Bluebird Coffee"
                : section === 'Groups'
                  ? 'Boston Foodies · Sunday Brunch Crew'
                  : section === 'People'
                    ? 'Carina M. · Mike L. · Emily R.'
                    : section === 'Recent Searches'
                      ? "Tacos near me · patio brunch · Joe's Pizza"
                      : 'North End Pizza Walk · Seaport Coffee Crawl'}
            </Typography>
          </Box>
        ))}
      </ScreenBlock>

      <ScreenBlock
        title="8) Entity Creation Flow"
        subtitle="Find existing place first, otherwise create a new entity."
      >
        <Chip label="Step 1: Search Google Places" color="primary" variant="outlined" />
        <Stack spacing={0.8} sx={{ my: 1.5 }}>
          {["Joe's Pizza", "Joe's Pizza Express", "Joe's Pizza Downtown"].map((place) => (
            <Card key={place} variant="outlined" className="entities-mock__search-option">
              <CardContent sx={{ py: 1.25 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {place}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                This place already exists.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="outlined">View</Button>
                <Button variant="contained">Create Plan</Button>
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Not found?
              </Typography>
              <Typography variant="body2" className="entities-mock__muted">
                Create a new entity and be the first to plan here.
              </Typography>
              <Button variant="contained" sx={{ mt: 1 }}>
                Create Entity
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="9) Favorites"
        subtitle="Curated collections in beautiful visual grids."
      >
        <Box className="entities-mock__grid">
          {['Coffee Shops', 'Pizza', 'Date Night', 'Brunch', 'Cocktail Bars'].map(
            (collection, index) => (
              <Card key={collection} className="entities-mock__collection-card">
                <Box
                  className="entities-mock__collection-image"
                  sx={{ backgroundImage: `url(${restaurants[index % restaurants.length].cover})` }}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {collection}
                  </Typography>
                  <Typography variant="caption" className="entities-mock__muted">
                    {6 + index} places
                  </Typography>
                </CardContent>
              </Card>
            ),
          )}
        </Box>
      </ScreenBlock>

      <ScreenBlock
        title="10) Home Feed"
        subtitle="Personalized weekly planning dashboard."
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Button variant="contained">Create Plan</Button>
          <Button variant="outlined">Find a Place</Button>
          <Button variant="outlined">Invite Friends</Button>
        </Stack>

        <Stack spacing={1}>
          {[
            'Plans This Week',
            'Your Groups',
            'Recommended Restaurants',
            'Friends Recently Visited',
            'Trending Nearby',
          ].map((section) => (
            <Card key={section} variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {section}
                </Typography>
                <Typography variant="body2" className="entities-mock__muted">
                  {section === 'Plans This Week'
                    ? 'Wed 7:30 PM at Harbor Cafe · Sat 12:00 PM at Riverside Tacos'
                    : section === 'Your Groups'
                      ? 'Boston Foodies · North End Pizza Walk'
                      : section === 'Recommended Restaurants'
                        ? 'Corner Bakery for Sunday brunch · The Local Taproom for trivia night'
                        : section === 'Friends Recently Visited'
                          ? 'Carina at Bluebird Coffee · Mike at Boston Dumpling House'
                          : "Joe's Pizza · Harbor Cafe · Corner Bakery"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="Polished Empty States"
        subtitle="Friendly local copy and guidance."
      >
        <Box className="entities-mock__grid">
          {[
            ['No plans yet', 'Start with a coffee meetup this weekend.'],
            ['No nearby spots', 'Try widening your radius to discover new neighborhoods.'],
            ['No recommendations yet', 'Be the first to recommend your favorite place.'],
          ].map(([title, body]) => (
            <Card key={title} variant="outlined" className="entities-mock__empty-card">
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {title}
                </Typography>
                <Typography variant="body2" className="entities-mock__muted">
                  {body}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ScreenBlock>

      <ScreenBlock
        title="Loading Skeletons"
        subtitle="Detail, discovery, and card loading states."
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
              Entity Detail Skeleton
            </Typography>
            <Skeleton variant="rectangular" height={190} sx={{ borderRadius: 2 }} />
            <Skeleton width="42%" sx={{ mt: 1 }} />
            <Skeleton width="70%" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
              Search Results Skeleton
            </Typography>
            {[1, 2, 3].map((idx) => (
              <Stack key={idx} direction="row" spacing={1.25} sx={{ mb: 1 }}>
                <Skeleton variant="rounded" width={74} height={58} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="50%" />
                  <Skeleton width="78%" />
                </Box>
              </Stack>
            ))}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
              Card Skeleton
            </Typography>
            <Card variant="outlined">
              <Skeleton variant="rectangular" height={130} />
              <CardContent>
                <Skeleton width="56%" />
                <Skeleton width="40%" />
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </ScreenBlock>

      <ScreenBlock
        title="Realistic Mock Data Snapshot"
        subtitle="Local names, addresses, hours, dishes, and social metadata."
      >
        <Stack spacing={1}>
          {restaurants.map((restaurant) => (
            <Card key={`snapshot-${restaurant.id}`} variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {restaurant.name} · {restaurant.cuisine}
                </Typography>
                <Typography variant="body2" className="entities-mock__muted">
                  {restaurant.address} · {restaurant.hours}
                </Typography>
                <Typography variant="caption" className="entities-mock__muted">
                  Popular dishes: {restaurant.dishes.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </ScreenBlock>

      <Box className="entities-mock__floating-action">
        <Button startIcon={<DiningIcon />} variant="contained" size="large">
          Start New Food Plan
        </Button>
      </Box>
    </Box>
  );
}
