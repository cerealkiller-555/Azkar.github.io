# Azkar App (تطبيق الأذكار)

A comprehensive React-based web application for daily Islamic invocations (Azkar), prayer times, and more. The application features a beautiful, dynamic Arabic user interface (RTL) built with React and Tailwind CSS.

## Features

- 🌅 **Morning Azkar (أذكار الصباح):** A curated list of authentic morning invocations with counters, benefits (virtues), and sources.
- 🌙 **Evening Azkar (أذكار المساء):** Authentic evening invocations with progress tracking.
- 🕌 **Prayer Times (مواقيت الصلاة):** Fetches accurate daily prayer times based on the user's geographical location using the Aladhan API.
- 🤲 **Custom Duas (أدعية مخصصة):** Allows users to add, manage, and delete their own personal supplications.
- ⚙️ **Settings & Preferences:** Users can customize daily notification times and update their default location (city/country) for accurate prayer times.
- ✅ **Progress Tracking:** Clickable check buttons to mark individual azkar as completed.

## Technologies Used

- **React:** For building the interactive user interface and state management.
- **Tailwind CSS:** For styling, responsive design, and providing an elegant and modern aesthetic with smooth gradients.
- **Lucide React:** For beautiful, scalable vector icons.
- **Aladhan API:** For fetching precise prayer times.

## Getting Started

1. Clone or download the repository.
2. If this is a standalone component, integrate it into your React project.
3. Install the required dependencies:
   ```bash
   npm install lucide-react react
   ```
   *(Ensure Tailwind CSS is correctly set up in your project environment)*
4. Import and use the `AzkarApp` component.

## Future Enhancements
- Save user progress and preferences to `localStorage`.
- Implement actual push notifications based on times selected in settings.
- Add audio recitations for Azkar.