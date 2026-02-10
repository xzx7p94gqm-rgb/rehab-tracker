# Rehab Tracker — Quadriceps Tendinosis

## About

A React-based rehabilitation tracking dashboard built for **Jason Coghlan** to monitor progress in his quadriceps tendinosis (left knee) rehabilitation programme.

### Medical Team
- **Consultant:** Professor Éanna Falvey, Consultant Sports & Exercise Medicine Physician, Cork
- **Physio:** Patrick Hanley, APC Physiotherapy Clinic, Fermoy, Co. Cork

### Diagnosis
Quadriceps tendinosis — left knee. This is a degenerative condition of the quadriceps tendon (above the kneecap) requiring progressive mechanical loading to stimulate collagen remodelling.

---

## Background & Rehabilitation Context

### Current Phase: Phase 2-3 Transition (Heavy Slow Resistance + Single Leg Work)

The rehabilitation programme follows Professor Falvey's protocol (22/08/2025):
- Load at 75% of previous working weight
- Cycle immediately after loading sessions
- Rest the next day
- Load again on day three even if sore (DOMS variant suspected)
- Build cycling distance toward 40km target

### Weekly Structure
- **Monday, Wednesday, Friday:** Loading sessions + cycling
- **Tuesday, Thursday, Saturday:** Rest days with light yoga and core work
- **Sunday:** Full rest

### Loading Session Order
1. Collagen + Vitamin C (45 mins before)
2. Warm-up (bike forward/reverse, monster walks, glute bridges)
3. Loading exercises
4. Cycle ride
5. Cool down (Apple Fitness guided + stretches)

### Exercises (from Patrick Hanley's programme)
| Exercise | Sets × Reps | Load |
|----------|-------------|------|
| Single Leg Extension | 3 × 6-8 | Heavy 8/10 effort |
| Split Squats (foot on bench) | 3 × 8-10 | 15kg each arm |
| Spanish Squats (with band) | 3 × 8-10 | 30kg+ |
| SL Heel Raise | 3 sets to fatigue | 15kg same side hand |
| Weighted Step-ups | 15 each leg | Heavy 8/10 effort |
| Reverse Nordic Curl (new) | 3 × 4-6 | Bodyweight |
| Goblet Squat (new) | 3 × 8-10 | 10-15kg |

Wednesday sessions swap in the Reverse Nordic Curl and Goblet Squat for variety.

### Cycling Targets (Post-Loading)
| Metric | Target Range |
|--------|-------------|
| Power | 75-95W |
| Cadence | 85-95 RPM |
| Heart Rate | 100-118 BPM |
| Effort | 4-5 / Moderate |
| Route | Flat, minimal elevation |

### Pain Guidelines
- **0-3/10 during exercise:** Acceptable
- **Above 5/10:** Reduce load by 20%
- **Morning-after worse than baseline:** Scale back next session
- **Settles within 24 hours:** Good zone

### Supplements (Pre-Session)
- NaturesPlus Collagen Peptides: 2 scoops (23g) — 20g collagen + 92mg Vitamin C
- SOMEGA Liposomal Vitamin C: 1-2 teaspoons — 330-670mg Vitamin C
- Combined ~500mg Vitamin C to match research protocol for tendon collagen synthesis

---

## Tech Stack

- **React 18** — UI framework
- **Recharts** — Charts and data visualisation
- **localStorage** — Data persistence (browser-based)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)
- VS Code (recommended)

### Installation

```bash
# Clone or copy this folder to your machine
cd rehab-tracker

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### VS Code with Claude

This project is designed to be extended using VS Code with Claude's chat agent. Some ideas for enhancements:

- **Apple Health integration** — import cycling data directly from exported Apple Health XML
- **Weekly summary reports** — auto-generate a summary to share with Patrick
- **Photo logging** — attach Apple Fitness screenshots to sessions
- **Progressive overload calculator** — suggest weight increases based on pain trends
- **Dark/light theme toggle**
- **Mobile PWA** — make it installable on your phone
- **Print-friendly reports** for consultant visits

---

## Data Management

### Storage
Data is stored in the browser's localStorage. It persists between sessions but is browser-specific.

### Export
- **JSON export** — full data backup, can be re-imported
- **CSV export** — spreadsheet-friendly format for sharing with medical team

### Backup
It's recommended to export your data regularly (weekly) as a JSON backup. localStorage can be cleared if browser data is reset.

---

## Project Structure

```
rehab-tracker/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── index.js            # React entry point
│   └── App.jsx             # Main application (all components)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## Key Dates

| Date | Event |
|------|-------|
| 02/04/1974 | DOB |
| 22/08/2025 | Last consultation with Professor Falvey |
| 02/04/2025 | Patrick Hanley's programme issued |
| 10/02/2026 | First session back after 2-week break (10kg extensions, 2×10kg split squats/Spanish squats) |

---

## Notes

- This tracker complements the full rehabilitation document (knee_rehab_program.docx)
- Always follow Professor Falvey's and Patrick's advice over any information in this app
- The pain tracking is particularly useful for identifying patterns between loading weights, cycling intensity, and tendon response
