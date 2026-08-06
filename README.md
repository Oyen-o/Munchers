# Munchers - Event Planning Application

A full-stack event planning application built with NX monorepo, Next.js, Material UI, and Azure Cosmos DB.

## 🏗️ Architecture

- **Frontend (web)**: Next.js 14+ with App Router, Material UI, Framer Motion
- **Backend (bff)**: Express.js backend-for-frontend with Azure Cosmos DB integration
- **Monorepo**: NX workspace for efficient development and builds

## 🎨 Design System

- **MUI Theming**: Custom theme with CSS variables for consistency
- **SCSS Variables**: Centralized design tokens for colors, typography, and spacing
- **BEM Methodology**: Block Element Modifier naming convention for SCSS
- **Reusable Components**: Atomic design pattern with atoms and components
- **No CSS Modules**: Global SCSS with BEM naming

## 📦 Features

### User Management
- Phone number-based authentication
- User profiles with ideas
- Push ideas to groups

### Groups
- Create and manage groups
- Group member roles (admin, member)
- Group-level events and comments

### Events
- Three stages: Idea → Planned → Completed
- Events can belong to users or groups
- Event hosting and planning details
- Comments on events
- Ratings (average visible only to group admins)

### Home Screen
- Animated logo with fade and slide-up effect
- Phone number login interface
- Smooth transitions with Framer Motion

### Groups Menu
- List of user's groups
- Event filtering by stage (Idea, Planned, Completed)
- Event details with host and planning information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Azure Cosmos DB account

### Installation

1. **Navigate to the workspace**
   ```bash
   cd munchers-app
   npm install
   ```

2. **Configure BFF Environment**
   ```bash
   cd bff
   cp .env.example .env
   ```
   
   Edit `.env` with your Cosmos DB credentials:
   ```env
   COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
   COSMOS_KEY=your-key-here
   COSMOS_DATABASE_ID=munchers-db
   ```

3. **Configure Web Environment**
   ```bash
   cd ../web
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_BFF_URL=http://localhost:3001
   ```

### Development

Run both applications:

```bash
# From the root directory

# Start BFF (port 3001)
npx nx serve bff

# In another terminal, start Web (port 4200)
npx nx serve web
```

### Build

```bash
# Build BFF
npx nx build bff

# Build Web
npx nx build web

# Build all
npx nx run-many --target=build --all
```

## 📁 Project Structure

```
munchers-app/
├── bff/                          # Backend for Frontend
│   ├── src/
│   │   ├── db/
│   │   │   └── cosmos.ts         # Cosmos DB client
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── groups.ts
│   │   │   ├── events.ts
│   │   │   ├── comments.ts
│   │   │   └── ratings.ts
│   │   └── main.ts
│   └── .env.example
│
├── web/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # SSR route handlers
│   │   │   ├── groups/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── atoms/                # Atomic components
│   │   ├── components/
│   │   ├── themes/
│   │   └── lib/
│   └── .env.local.example
│
└── README.md
```

## 🎯 Key Technical Decisions

- **No CSS Modules**: Global SCSS with BEM methodology
- **CSS Variables**: All colors and fonts use CSS custom properties  
- **Container Classes**: All components wrapped in `___container` className
- **MUI Typography**: All text elements use MUI Typography component
- **SSR Only for Cosmos DB**: Database connections only in Next.js route.ts files
- **BFF Pattern**: Express backend handles all Cosmos DB operations

## 🛠️ API Endpoints

### Users
- `POST /api/users/login` - Login/create user
- `GET /api/users/:id` - Get user by ID

### Groups
- `GET /api/groups/user/:userId` - Get user's groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/members` - Add member

### Events
- `GET /api/events/user/:userId` - Get user's events
- `GET /api/events/group/:groupId` - Get group's events
- `POST /api/events` - Create event
- `PATCH /api/events/:id/stage` - Update event stage

### Comments & Ratings
- `GET /api/comments/event/:eventId` - Get comments
- `POST /api/comments` - Add comment
- `POST /api/ratings` - Add/update rating

## 📝 Next Steps

- [ ] Implement phone number authentication
- [ ] Add user profile management
- [ ] Implement event commenting UI
- [ ] Add event rating interface
- [ ] Create navigation component
- [ ] Add loading states and error handling

## 🔗 Useful Nx Links

- [Nx Documentation](https://nx.dev)
- [Nx Console for VSCode](https://nx.dev/getting-started/editor-setup)
- [Run `npx nx graph` to visualize the project structure](https://nx.dev/features/explore-graph)
