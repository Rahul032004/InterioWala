# InteriorWala - Interior Design Templates

A modern React application for browsing and managing interior design templates. Built with Vite, React, TypeScript, and Supabase.

## Features

- 🏠 Browse interior design templates by category
- ❤️ Save favorite designs
- 📱 Responsive design for mobile and desktop
- 🔐 User authentication and profiles
- 📊 User dashboard with projects and favorites
- 📞 Contact support system
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Storage)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Run the SQL commands from `lib/database.sql` in your Supabase SQL editor
   - This will create the necessary tables and policies

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   ├── figma/         # Figma-specific components
│   └── ...            # Page components
├── lib/               # Utilities and services
│   ├── services.ts    # API service functions
│   ├── supabase.ts   # Supabase client and types
│   └── database.sql   # Database schema
├── styles/            # Global styles
└── App.tsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:

- **profiles** - User profile information
- **designs** - Design templates
- **projects** - User projects based on designs
- **user_favorites** - User's favorite designs
- **contacts** - Contact form submissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.