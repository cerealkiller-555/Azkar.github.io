# Azkar App (تطبيق الأذكار)

A comprehensive React-based web application for daily Islamic invocations (Azkar), prayer times, and more. The application features a modern Arabic-first UI with optional English mode, built with React and Tailwind CSS.

## Features

- 🌅 **Morning Azkar (أذكار الصباح):** A curated list of authentic morning invocations with counters, benefits, and sources.
- 🌙 **Evening Azkar (أذكار المساء):** Authentic evening invocations with progress tracking.
- 🕌 **Prayer Times (مواقيت الصلاة):** Fetches accurate daily prayer times based on the user's location using the Aladhan API.
- ✅ **Prayer Checklist:** Track the five daily prayers alongside prayer times.
- 🔥 **Streaks:** Builds a daily streak when morning azkar, evening azkar, and the five prayers are completed.
- 🤲 **Custom Duas (أدعية مخصصة):** Add, manage, and delete personal supplications.
- 🔐 **Login:** Simple local login to save user info on the device.
- 🌍 **Language Toggle:** Switch between Arabic and English in settings.
- ⚙️ **Settings & Preferences:** Update default location, appearance, and profile info.

## Technologies Used

- **React:** For building the interactive user interface and state management.
- **Tailwind CSS:** For styling, responsive design, and providing an elegant and modern aesthetic with smooth gradients.
- **Lucide React:** For beautiful, scalable vector icons.
- **Aladhan API:** For fetching precise prayer times.

## Getting Started

1. Clone or download the repository.
2. Run a local web server from the project folder:
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser.

## Future Enhancements
- Push notifications for prayer times and azkar reminders.
- Cloud sync for user profiles and streaks.
- Audio recitations for azkar.
