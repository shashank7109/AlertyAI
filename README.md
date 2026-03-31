# AlertyAI - Intelligent Task & Team Management

AlertyAI is a modern, AI-powered productivity platform that helps teams stay organized, collaborate seamlessly, and get more done. This repository contains the web frontend built with React and Next.js.

## About AlertyAI

AlertyAI combines task management, team collaboration, and artificial intelligence to create a smarter way to work. Whether you're managing personal tasks, coordinating with your team, or planning sprints, AlertyAI adapts to your workflow.

**Get Started:**
- Download on [Google Play Store](https://play.google.com/store/apps/details?id=com.alertyai.app)
- Visit [com.alertyai.app](https://com.alertyai.app)
- Check out our [website](https://alertyai.com)

## Key Features

- **Smart Task Management** - Create, organize, and prioritize tasks with AI-powered suggestions
- **Team Collaboration** - Work together seamlessly with real-time updates and team calendars
- **AI Assistant** - Get intelligent insights and automatic task categorization
- **Calendar Integration** - Visualize your schedule and manage deadlines
- **Cross-platform** - Access your tasks on web, mobile, and desktop

## Tech Stack

This frontend is built with modern technologies for performance and developer experience:

- **Next.js 16** - React framework with server-side rendering and optimization
- **React 19** - Latest React for building interactive user interfaces
- **Tailwind CSS v4** - Utility-first CSS for rapid UI development
- **TypeScript** - Type-safe JavaScript development
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - State management for global app state
- **Axios** - HTTP client for API communication

## Getting the App

### For Users

Download AlertyAI directly from the Google Play Store:

- [Download on Google Play Store](https://play.google.com/store/apps/details?id=com.alertyai.app)

No installation needed - just download, install, and start being productive.

### For Developers

If you want to contribute to the frontend or run it locally for development:

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager

**Setup:**

```bash
# Install dependencies
npm install

# Copy the environment template
cp .env.example .env.local

# Configure your API endpoint
# Edit .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Main application pages
│   ├── dashboard/          # Main dashboard view
│   ├── tasks/              # Task management
│   ├── teams/              # Team collaboration
│   ├── calendar/           # Calendar and scheduling
│   ├── ai-assistant/       # AI-powered features
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
│   ├── TaskCard.tsx        # Task display component
│   ├── TeamPanel.tsx       # Team management UI
│   ├── NavBar.tsx          # Navigation header
│   └── ...
├── lib/                    # Utility functions
│   ├── api.ts              # API client
│   └── utils.ts            # Helper functions
└── store/                  # State management
    └── useStore.ts         # Zustand store
```

## Available Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Create optimized production build
npm start        # Run production server
npm run lint     # Check code quality with ESLint
```

## Configuration

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Make sure this points to your AlertyAI backend API server.

## Styling

We use Tailwind CSS v4 for a modern, responsive design. All custom styles and theme configuration are in the Tailwind config file.

## Dark Mode

The application supports light and dark modes:

```javascript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark')  // Switch to dark mode
```

## API Integration

The API client handles communication with the backend:

```javascript
import { taskAPI } from '@/lib/api'

// Fetch all tasks
const tasks = await taskAPI.getAll()

// Create a new task
await taskAPI.create({ title: 'New task', description: 'Task details' })
```

## State Management

We use Zustand for managing application state:

```javascript
import { useTaskStore } from '@/store/useStore'

const { tasks, setTasks, addTask } = useTaskStore()
```

## Responsive Design

The interface works smoothly across all devices:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)

All UI elements are touch-friendly and optimized for both small and large screens.

## Deployment

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

```bash
npm install -g vercel
vercel
```

### Other Platforms

1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL

## Troubleshooting

### Build or Runtime Errors

If you encounter issues, try clearing the cache and reinstalling dependencies:

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### API Connection Issues

Make sure your `.env.local` file has the correct `NEXT_PUBLIC_API_URL` pointing to your backend server.

## Contributing

We welcome contributions to AlertyAI. Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests with improvements

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Links

- GitHub Mobile App: [AlertyAI_apk](https://github.com/shashank7109/AlertyAI_apk)
- Play Store: [com.alertyai.app](https://play.google.com/store/apps/details?id=com.alertyai.app)
- Website: [AlertyAI](https://alertyai.com)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Built with passion for better productivity and teamwork.

### Tailwind styles not working
- Check `@import "tailwindcss"` is in globals.css
- Verify postcss.config.mjs exists
- Restart dev server

### Port already in use
```bash
npx kill-port 3000
```

## ✅ Checklist

- [x] Next.js 16 setup
- [x] Tailwind CSS v4 configured
- [x] React 19 installed
- [x] All components copied
- [x] API client configured
- [x] State management setup
- [x] Dark mode working
- [x] Responsive design
- [x] Authentication pages
- [x] Dashboard complete
- [x] All features implemented

## 📜 License

This project is licensed under the AlertyAI Software License — see the [LICENSE](LICENSE) file for details.

## 🎉 Ready to Go!

Your frontend is now using the latest technologies:
- Next.js 16 ✅
- React 19 ✅  
- Tailwind CSS v4 ✅

Run `npm run dev` and start building! 🚀
