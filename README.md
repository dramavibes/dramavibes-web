# DramaVibes Web

> Find your next Asian drama by vibe, not just title.

DramaVibes is a web app that helps users discover Asian dramas based on mood, tone, and emotional experience.

Check it out at: [https://dramavibes.netlify.app/](https://dramavibes.netlify.app/)

## Features

- Vibe-based semantic search
- AI-powered summaries and classifications
- Rich filtering (tone, pacing, romance level, emotional weight, etc.)
- Detailed title pages with summaries and insights

## Tech Stack

- React
- TailwindCSS
- HeroUI
- TanStack Query (React Query)
- Axios

## Getting Started

### Prerequisites
- node
- npm 

### Installation

```bash
git clone https://github.com/dramavibes/dramavibes-web.git
cd dramavibes-web
npm install
```

### Run
```bash
npm run dev
```

### Backend

This needs a backend, the URL for which needs to be added in a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:8000
```

Find the repository for backend at: [https://github.com/dramavibes/dramavibes-api](https://github.com/dramavibes/dramavibes-api)