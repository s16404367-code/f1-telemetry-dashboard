# F1 Telemetry Dashboard - Complete Project Structure

## Directory Layout

```
f1-dashboard/
│
├── src/                                 # Source code
│   ├── components/
│   │   ├── Dashboard.tsx               # Main dashboard container
│   │   ├── SessionSelector.tsx         # Meeting/session selector
│   │   ├── TrackMap.tsx               # SVG circuit visualization
│   │   ├── TimingTower.tsx            # FIA-style standings
│   │   ├── DriverPanel.tsx            # Detailed telemetry
│   │   ├── LoadingScreen.tsx          # Loading state
│   │   ├── ReplayControls.tsx         # Playback controls
│   │   └── modes/
│   │       ├── LiveMode.tsx           # Real-time mode
│   │       └── HistoricalMode.tsx     # Replay mode
│   │
│   ├── services/
│   │   ├── openf1Client.ts            # API client with caching
│   │   └── telemetryProcessor.ts      # Data processing
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # React entry point
│   └── index.css                       # Global styles
│
├── index.html                          # HTML template
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript config
├── tsconfig.node.json                  # Node TypeScript config
├── tailwind.config.js                  # Tailwind CSS config
├── postcss.config.js                   # PostCSS config
│
├── package.json                        # Dependencies
├── .gitignore                          # Git ignore rules
│
├── dist/                               # Production build (generated)
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
│
├── README.md                           # Project overview
├── GITHUB_PAGES_DEPLOYMENT.md          # Deployment guide
├── DEPLOYMENT_CHECKLIST.md             # Testing checklist
└── PROJECT_STRUCTURE.md                # This file
```

---

## File Descriptions

### Core Files

#### `index.html`
- HTML entry point
- Loads React root element
- Includes Roboto font from Google Fonts
- Meta tags for viewport and charset

#### `src/main.tsx`
- React application entry point
- Mounts App component to #root element
- Imports global CSS

#### `src/App.tsx`
- Root React component
- Handles API connection test
- Shows loading/error states
- Renders Dashboard component

### Components

#### `src/components/Dashboard.tsx`
- Main container component
- Manages mode switching (Live/Historical)
- Loads meetings and sessions
- Orchestrates layout
- Handles session selection

#### `src/components/SessionSelector.tsx`
- Dropdown selectors for meetings and sessions
- Handles loading states
- Disabled when loading

#### `src/components/modes/LiveMode.tsx`
- Real-time telemetry display
- Polls OpenF1 API every 1 second
- Updates driver positions
- Shows live standings

#### `src/components/modes/HistoricalMode.tsx`
- Historical session replay
- Loads all session data
- Manages timeline and playback
- Interpolates frames

#### `src/components/TrackMap.tsx`
- SVG circuit visualization
- Renders driver dots
- Shows driver numbers and positions
- Handles driver selection

#### `src/components/TimingTower.tsx`
- FIA-style standings display
- Shows gaps to leader
- Displays tyre information
- Sorted by position

#### `src/components/DriverPanel.tsx`
- Detailed telemetry display
- Shows lap times
- Displays real-time metrics
- Shows pit stop information

#### `src/components/ReplayControls.tsx`
- Playback controls (play, pause)
- Speed selector (0.25x to 4x)
- Timeline slider
- Frame counter

#### `src/components/LoadingScreen.tsx`
- Loading state display
- Shows spinner
- Displays loading message

### Services

#### `src/services/openf1Client.ts`
- HTTP client using axios
- Implements caching (30-second TTL)
- Safe error handling
- Methods for all API endpoints:
  - getMeetings()
  - getSessions()
  - getDrivers()
  - getLocation()
  - getIntervals()
  - getLaps()
  - getStints()
  - getWeather()
  - getCarData()
  - getPitData()
  - getRaceControl()

#### `src/services/telemetryProcessor.ts`
- Data normalization
- Safe null/undefined handling
- Coordinate normalization
- Type definitions
- Helper methods:
  - processDriver()
  - processLocation()
  - processInterval()
  - processLap()
  - processStint()
  - processCarData()

### Styling

#### `src/index.css`
- Global Tailwind imports
- Custom animations
- Scrollbar styling
- Component-specific styles
- Responsive design rules

#### `tailwind.config.js`
- Custom color theme
- F1-specific colors
- Font configuration
- Extends default theme

#### `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

### Configuration

#### `vite.config.ts`
- Vite build configuration
- React plugin setup
- Dev server settings
- Build optimization

#### `tsconfig.json`
- TypeScript strict mode
- Target ES2020
- Path aliases (@/*)
- JSX configuration

#### `package.json`
- Project metadata
- Dependencies list
- Dev dependencies
- Build scripts

---

## Data Flow

### Live Mode Flow

```
OpenF1 API
    ↓
openf1Client.get()
    ↓ (cached for 30s)
LiveMode component
    ↓
TelemetryProcessor.process*()
    ↓
State update
    ↓
Re-render components
    ↓
TrackMap, TimingTower, DriverPanel
```

### Historical Mode Flow

```
OpenF1 API
    ↓
Load all location data
    ↓
Group by timestamp
    ↓
HistoricalMode component
    ↓
Playback loop (50ms intervals)
    ↓
Update frame index
    ↓
Re-render with current frame
    ↓
TrackMap, TimingTower, DriverPanel
```

---

## Component Hierarchy

```
App
├── LoadingScreen (conditional)
├── Error Display (conditional)
└── Dashboard
    ├── Header
    │   ├── Mode Selector
    │   └── SessionSelector
    └── Main Content
        ├── LiveMode
        │   ├── TrackMap
        │   ├── TimingTower
        │   └── DriverPanel
        └── HistoricalMode
            ├── TrackMap
            ├── TimingTower
            ├── ReplayControls
            └── DriverPanel
```

---

## Type Definitions

### DriverTelemetry Interface

```typescript
interface DriverTelemetry {
  driverNumber: number
  firstName: string
  lastName: string
  teamName: string
  teamColour: string
  position: number
  gapToLeader: number | null
  gapToAhead: number | null
  currentLapTime: number
  bestLapTime: number
  lastLapTime: number
  lapNumber: number
  speed: number
  throttle: number
  brake: number
  gear: number
  rpm: number
  tyreCompound: string
  tyreAge: number
  pitCount: number
  drsEnabled: boolean
  trackX: number
  trackY: number
}
```

---

## API Endpoints

### Meetings
```
GET /meetings?year=2025
Returns: Array of meetings for the year
```

### Sessions
```
GET /sessions?meeting_key=1234
Returns: Array of sessions for a meeting
```

### Drivers
```
GET /drivers?session_key=5678
Returns: Array of drivers in a session
```

### Location
```
GET /location?session_key=5678
Returns: Array of location data points
```

### Intervals
```
GET /intervals?session_key=5678
Returns: Array of gap data
```

### Laps
```
GET /laps?session_key=5678
Returns: Array of lap data
```

### Stints
```
GET /stints?session_key=5678
Returns: Array of stint data (tyres)
```

---

## Build Process

### Development
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173/
```

### Production Build
```bash
npm run build
# Outputs to dist/ folder
# Minified, optimized, ready for deployment
```

### Preview
```bash
npm run preview
# Serves dist/ locally for testing
```

---

## Deployment

### GitHub Pages
1. Push to GitHub
2. Enable Pages in Settings
3. Select main branch and / (root) folder
4. Access at https://USERNAME.github.io/f1-telemetry-dashboard/

### Other Hosting
- Vercel: Deploy dist/ folder
- Netlify: Deploy dist/ folder
- AWS S3: Upload dist/ folder
- Any static hosting: Upload dist/ folder

---

## Performance Optimizations

### Caching
- API responses cached for 30 seconds
- Prevents duplicate requests
- Reduces network traffic

### Code Splitting
- React lazy loading
- Component-based architecture
- Tree-shaking in production build

### Rendering
- Efficient SVG rendering
- Minimal re-renders
- Memoized components

### Bundle Size
- ~120 KB gzipped
- Optimized dependencies
- Minified production build

---

## Error Handling

### API Errors
- Try-catch blocks in all API calls
- Fallback to empty arrays
- Console error logging
- User-friendly error messages

### Data Validation
- Null/undefined checks
- Type safety with TypeScript
- Safe property access
- Default values

### UI Errors
- Error boundary component
- Loading states
- Retry buttons
- Clear error messages

---

## Future Enhancements

### Features
- [ ] More circuit maps
- [ ] Weather visualization
- [ ] Race control timeline
- [ ] Sector analysis
- [ ] Driver comparison
- [ ] Telemetry graphs

### Performance
- [ ] Virtual scrolling
- [ ] Data compression
- [ ] Service workers
- [ ] Progressive image loading

### UX
- [ ] Mobile optimization
- [ ] Keyboard shortcuts
- [ ] Theme switching
- [ ] Data export

---

## Development Guidelines

### Adding a New Component

1. Create file in `src/components/ComponentName.tsx`
2. Define TypeScript interface for props
3. Use Tailwind CSS for styling
4. Export as default
5. Import and use in parent

### Adding a New Service

1. Create file in `src/services/serviceName.ts`
2. Export singleton or class
3. Add error handling
4. Document methods
5. Import in components

### Adding a New Feature

1. Plan data flow
2. Add API calls if needed
3. Create components
4. Add services
5. Test thoroughly
6. Update documentation

---

## Troubleshooting Guide

### Build Fails
- Check Node.js version (16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

### Dev Server Won't Start
- Check port 5173 is available
- Clear Vite cache: `rm -rf .vite`
- Reinstall dependencies

### Components Not Rendering
- Check console for errors
- Verify imports are correct
- Check component props
- Verify state updates

### API Not Responding
- Check internet connection
- Verify OpenF1 API is online
- Check browser console
- Try different session

---

## Resources

- **OpenF1 API:** https://openf1.org/
- **Vite:** https://vitejs.dev/
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **Tailwind CSS:** https://tailwindcss.com/

---

**Last Updated:** May 27, 2026
**Version:** 1.0.0
**Status:** Production Ready
