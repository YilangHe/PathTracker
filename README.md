# RidePATH Arrivals

A real-time PATH train arrivals tracker built with Next.js, React, and Tailwind CSS.

## Features

- **Real-time arrivals**: Fetches live PATH train arrival data every 10 seconds
- **Station selection**: Choose from all PATH stations
- **Visual indicators**: Color-coded line bullets and arrival time heat map
- **Responsive design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Framer Motion animations
- **CORS proxy fallback**: Handles API access issues gracefully

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Data Source

Train arrival data is provided by the Port Authority of NY & NJ via their public API.
