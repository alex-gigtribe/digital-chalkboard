# Digital Chalkboard - Bin Tracking Dashboard

React SPA for live bin tracking and team performance monitoring across 6 farm depots.

## Login Flow

**Testing/Demo:**
- Username: `admin`  
- Password: `admin`
- Uses mock data for demonstration

**Production:**
- Real user credentials → Real API endpoints
- Data filtered by SecurityGroupId from login token
- Users only see depots/teams they have access to

## Deployment

1. Deploy current version with mock data for testing
2. Update `API_ENDPOINTS` URLs when backend ready
3. Real users get database data, admin remains for demos

## Features

- Live dashboard with 30-second polling
- Team performance tracking (24 bins per picker target)  
- Day-over-day comparisons with localStorage caching
- Offline mode with cached data fallback
- Responsive design for smart TVs and mobile

## Architecture

- React + TypeScript + Tailwind CSS
- Context-based state management
- Graceful API error handling
- SecurityGroupId-based data isolation