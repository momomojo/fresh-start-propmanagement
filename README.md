# Property Management System

A modern property management system built with React, TypeScript, and Firebase.

## Features

- Role-based access control (Admin, Property Manager, Tenant)
- Property and unit management
- Tenant management
- Maintenance request tracking
- Document management
- Financial reporting
- Dark mode support

## Tech Stack

- React
- TypeScript
- Firebase (Auth, Firestore, Storage)
- Redux Toolkit
- TailwindCSS
- Shadcn UI
- Vite

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/property-management.git
cd property-management
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update Firebase configuration:

```typescript
// src/lib/firebase/config.ts
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

### Building

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/     # React components
  ├── lib/           # Core functionality
  │   ├── firebase/  # Firebase services
  │   ├── services/  # Business logic
  │   └── store/     # Redux store
  ├── pages/         # Page components
  └── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
