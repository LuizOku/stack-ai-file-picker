# Stack AI File Picker

A modern, responsive file picker component built with Next.js and TypeScript. This application allows users to browse, select, and index files from various connected sources into knowledge bases.

## Features

- 🗂️ **File System Navigation**
  - Browse through directories with an intuitive breadcrumb navigation
  - Quick return to root directory
  - Responsive sidebar for connection selection

- 🔍 **Search and Sort**
  - Real-time file and folder search
  - Sort by name or modification date
  - Directory-first sorting

- 🔄 **Knowledge Base Integration**
  - Create knowledge bases from selected files
  - Index multiple files simultaneously
  - Remove files from knowledge base (unindex)
  - Real-time indexing status updates
  - Automatic sync after indexing

- 💫 **Modern UI/UX**
  - Responsive design for mobile and desktop
  - Loading states and animations
  - Clean and intuitive interface
  - Geist font integration

## Tech Stack

- **Framework**: Next.js 15.2
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Token-based with automatic refresh

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_STACK_AI_API_URL=https://api.stack-ai.com      # Stack AI API base URL
NEXT_PUBLIC_SUPABASE_AUTH_URL=https://sb.stack-ai.com      # Supabase Auth URL

# Authentication
NEXT_PUBLIC_ANON_KEY=your_supabase_anon_key               # Supabase Anonymous Key
NEXT_PUBLIC_STACK_AI_EMAIL=your_email                     # Your Stack AI account email
NEXT_PUBLIC_STACK_AI_PASSWORD=your_password               # Your Stack AI account password
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LuizOku/stack-ai-file-picker.git
cd stack-ai-file-picker
```

2. Install dependencies:
```bash
yarn install
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            
│   ├── button/            # Reusable button component
│   ├── file-picker/       # Main file picker components
│   └── search-input/      # Search input component
├── services/
│   ├── api.ts            # API configuration and fetcher
│   └── hooks/            # Custom hooks for data fetching
├── shared/
│   └── resource.ts       # Shared types and interfaces
└── stores/
    ├── useApp.ts         # Application state management
    └── useAuth.ts        # Authentication state management
```

## Key Components

### FilePicker
The main component that orchestrates the file browsing experience. It includes:
- Connection selection via sidebar
- File/folder navigation
- Resource selection and indexing

### FileList
Displays the list of resources with features like:
- Sorting capabilities
- Search filtering
- Selection management
- Indexing status display

### Header
Provides navigation and actions including:
- Breadcrumb navigation
- Root directory access
- Indexing selected resources

## State Management

The application uses Zustand for state management with two main stores:

- **useApp**: Manages application state including:
  - Selected resources
  - Current integration
  - Navigation stack
  - Knowledge base ID

- **useAuth**: Handles authentication state:
  - Token management
  - Authentication status
  - Auto-logout on token expiration

## API Integration

The application integrates with a REST API using SWR for data fetching. Key features include:
- Automatic token refresh
- Error handling for 401 responses
- Optimistic updates for better UX

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
