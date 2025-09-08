# Digital ChalkboardV! - AdaginTech

PoC__Proof of Concept__Real-time agricultural bin tracking dashboard for Metaship.ai integration.

## Tech Stack
- React 18 + TypeScript
- Vite + Tailwind CSS
- Recharts for data visualization
- Deployed on Render.com

## Quick Start

```bash
# Install dependencies at root level, workspaces defined in root package.json "workspaces":
# [
#   "frontend",
#   "backend"
# ],
# do this in root, not in frontend and backend
npm install

# Run development server, no backend needed
cd frontend
npm run dev

```

## Deployment to Render

Push to GitHub and Render auto-deploys with `render.yaml` as blueprint
reverted to putting those commands in settings manually and then deploy worked as static page. 


## Features
- Live data tracking for 2 farms (Welgelegen, Boplaas) and 5 PUC's
- 5 apple varieties tracking, even if out of season 
- The apple harvesting season in the Western Cape generally runs from late January to late May. 
- The peak harvest period is typically from February to April.
- Real-time updates with current date/time (mocked to check current date)
- Mobile responsive PWA 
- Historical analysis (weekly/monthly/quarterly)
- Coming soon: ML-powered projections

## Structure
```
Mono repo
frontend/
├── public/
│   └── adagin-logo.svg
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   └── App.tsx
└── package.json
```

## TODO:
Current mock Datamodel document... 
API & Domain setup
Hubspot
getting daily data from Adagin 
Make sure its mobile nav & main nav compatible


---
© 2025 AdaginTech × Metaship.ai
