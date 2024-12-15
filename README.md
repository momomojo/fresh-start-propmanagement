# Property Management SaaS

A modern property management system built with React, TypeScript, and Firebase, designed to streamline property management operations with role-based access control.

## Features

- 🔐 Role-based access control (Admin, Property Manager, Tenant)
- 🏢 Comprehensive property and unit management
- 📊 Role-specific dashboards
- 📱 Responsive design with modern UI
- 🔄 Real-time updates using Firebase
- 📝 Document storage for properties

## Tech Stack

- Frontend: React 18 with TypeScript
- Build Tool: Vite
- State Management: Redux Toolkit
- Backend: Firebase (Authentication, Firestore, Storage)
- Styling: TailwindCSS
- Form Validation: Zod
- Testing: Jest & React Testing Library

## Prerequisites

- Node.js (Latest LTS version)
- npm or yarn
- Firebase account and project

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd fresh-start-propmanagement
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/services` - Firebase services
  - `/store` - Redux store and slices
  - `/types` - TypeScript types
  - `/utils` - Utility functions

## Role-Based Access

- **Admin**: Full system access
- **Property Manager**: Property and tenant management
- **Tenant**: Limited access to their data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please open an issue in the repository.
