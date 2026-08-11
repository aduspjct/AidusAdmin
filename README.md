# Aidus Admin Dashboard

A modern Next.js admin dashboard with Firebase backend integration.

## Features

- ⚡ Next.js 16 with App Router
- 🎨 Tailwind CSS v4 with custom theme
- 🔥 Firebase integration (Auth, Firestore, Storage)
- 🌓 Dark mode support
- 📱 Responsive design
- 🎯 TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── (admin)/     # Admin layout group
│   └── layout.tsx   # Root layout
├── components/      # React components
├── context/         # React context providers
│   ├── SidebarContext.tsx
│   └── ThemeContext.tsx
├── layout/          # Layout components
│   ├── AppHeader.tsx
│   ├── AppSidebar.tsx
│   └── Backdrop.tsx
└── lib/             # Utility libraries
    └── firebase/    # Firebase configuration
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" and add a web app
5. Copy the configuration values to your `.env.local` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Firebase

