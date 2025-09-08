#  Digital Chalkboard V1 – AdaginTech

**Proof of Concept**: Real-time digital chalkboard for **bin tracking at depots**, starting with **Hutton Squire depot**.
This app will serve as a microfrontend, deployed independently, and styled with the **AdaginTech theme pack**.

---

##  Tech Stack

* **React 18 + TypeScript** (SPA, microfrontend ready)
* **Vite + Tailwind CSS** (with AdaginTech theme applied)
* **Recharts** (for visual bin tracking)
* **Render.com** (deployment target – static site)

---

## Quick Start

```bash
# Install dependencies at root
npm install

# Run frontend (no backend required yet)
cd frontend
npm run dev
```

---

##  Deployment to Render

* Repo pushed to GitHub.
* Render set up as **static site** for `/frontend`.
* Auto-deploy on push (manual settings override `render.yaml` for now).

---

## Features

* Digital board for **Hutton Squire depot**
* Depot **selector** (dropdown with 6 depots available – PoC shows Hutton Squire)
* **Mock data refresh**: randomized bins & picker stats on each reload → mimics streaming data
* KPI cards (e.g., *Total Bins*, *Active Pickers*, *Progress*, *QC Flags*)
* Team performance table (per team: bins, pickers, average per picker, target, status)
* Mobile responsive (usable on tablet in depot office or phone in the field)

---

##  Theming

AdaginTech theme applied (per design system):

* Background: `#DAE8C8`
* Primary Blue: `#5a7784`
* Accent Green: `#a4cc4c`
* Navy: `#284350`
* Typography: **Arial Nova**, minimal Apple-like styling

---

##  Structure

```
frontend/
├── public/                # Adagin logos, icons
├── src/
│   ├── components/        # Charts, widgets, depot selector
│   ├── data/              # Mock data (randomized each reload)
│   ├── layout/            # Header, Footer, Layout
│   ├── pages/             # Dashboard.tsx (Hutton Squire board)
│   └── App.tsx
└── package.json
```

---

## 🔮 Roadmap

* Add **live API integration** (Azure DevOps DB → Frontend API)
* Extend chalkboard to **6 depots**
* Real-time **bin streaming** feed
* Microfrontend integration with other Adagin apps

---

© 2025 **AdaginTech** × Digital Chalkboard

