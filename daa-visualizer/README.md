# DAA Visualizer

An interactive web application that demonstrates **7 classic algorithms** through 6 real-world production-style tools. Built as a Design and Analysis of Algorithms (DAA) project.

## Apps & Algorithms

| App | Tagline | Algorithm | Paradigm | Industry |
|-----|---------|-----------|----------|----------|
| NaviRoute | GPS Route Planner | Dijkstra's Algorithm | Greedy | Logistics / Maps |
| PackSort | E-Commerce Order Sorter | Merge Sort + Quick Sort | Divide & Conquer | E-Commerce / Retail |
| ZipIt | File Compression Engine | Huffman Coding | Greedy | Storage / Networking |
| DiffScan | Code Diff Analyzer | Longest Common Subsequence | Dynamic Programming | DevTools / Version Control |
| NetSpan | Fiber Network Planner | Kruskal's Algorithm | Greedy | Telecom / Infrastructure |
| ShiftBoard | Conflict-Free Scheduler | N-Queens (Backtracking) | Backtracking | HR / Healthcare / Ops |

## Features

- Step-by-step algorithm visualization with play/pause controls
- Algorithm trace log showing each step in real time
- Dark-themed UI with per-app accent colors
- Real-world context for each algorithm

## Tech Stack

- **React 19** — UI
- **Vite 8** — Build tool & dev server
- **Vanilla CSS-in-JS** — All styling inline, no external UI library

## Getting Started

```bash
# Install dependencies
cd daa-visualizer
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
daa-visualizer/
├── src/
│   ├── App.jsx        # All 6 app visualizers + shared UI components
│   ├── App.css        # Global styles
│   ├── main.jsx       # React entry point
│   └── index.css      # Base styles
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## Other Files

- `DAAVisualizer.jsx` — Standalone single-file version of the visualizer
- `#include <iostream>.cpp` — C++ reference implementations of the algorithms
