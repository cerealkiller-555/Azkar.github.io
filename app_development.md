# App Development Guide & Roadmap

This document outlines the current state, architectural decisions, and an ongoing roadmap for developing the **Azkar App**.

## Architecture & Code Organization
- **Component File:** Currently housed completely in `script.js` as the `AzkarApp` component.
- **State Management:** Utilizing React Hooks (`useState` and `useEffect`) for simple app-wide states representing the currently active tab, user preferences, API data, and custom user input.
- **UI & Styling:** Tailwind CSS is deeply integrated into the markup. The design language emphasizes gradient themes for each specific section (Amber/Orange for morning, Indigo/Purple for evening, Emerald/Teal for standard layout).

## Ongoing Development Backlog

### High Priority
1. **Persistent State (Local Storage):**
   - Save the user's `completedAzkar` state so refreshing the page doesn't reset daily progress.
   - Save the `customDuas` array locally.
   - Save `preferences` and `location`.
2. **Notification System:**
   - Integrate Web Push API or standard browser Notification API to trigger alerts at the times defined in `preferences.morningTime` and `preferences.eveningTime`.
3. **PWA (Progressive Web App):**
   - Add a `manifest.json` and a service worker to make the app installable to users' home screens and usable entirely offline (prayer times would need daily caching).

### Medium Priority
1. **Refactoring & Modularity:**
   - Split `script.js` into multiple smaller components to make the project significantly more manageable:
     - `components/AzkarList.jsx`
     - `components/PrayerTimes.jsx`
     - `components/Settings.jsx`
     - `components/CustomDuas.jsx`
     - `components/Header.jsx`
   - Move raw data (e.g., `morningAzkar`, `eveningAzkar` arrays) to dedicated JSON files or a `data/azkar.js` configuration file to reduce component bloat.

### Low Priority / Nice-to-haves
1. **Audio Integration:** Play a specific audio file for an individual Azkar.
2. **Dark Mode:** Add an explicit dark mode toggle (independent of evening/morning routines).
3. **Multi-language Support:** English translation for users who prefer reading transliteration or meanings.

## Development Commands

If building this within a standard Webpack or Vite stack, usual commands apply:
- **Run dev server:** `npm run dev` or `npm start`
- **Build for production:** `npm run build`

*Focus on maintaining a clean and beautiful UX while we implement local persistent storage for the next major milestone.*
