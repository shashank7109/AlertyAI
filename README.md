# Smaran AI Frontend - Next.js 16 + Tailwind CSS v4

Modern, responsive frontend for Smaran AI productivity platform.

## 🚀 Tech Stack

- **Next.js 16** - Latest React framework with App Router
- **React 19** - Latest React version  
- **Tailwind CSS v4** - Latest utility-first CSS framework (new syntax!)
- **TypeScript Ready** - Full TypeScript support
- **Framer Motion 11** - Smooth animations
- **Zustand 5** - State management
- **React Hot Toast** - Beautiful notifications
- **Axios** - HTTP client
- **React Icons** - Icon library
- **date-fns** - Date utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

## 🎨 Tailwind CSS v4 Changes

This project uses **Tailwind CSS v4** which has a NEW syntax:

### Old (v3):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### New (v4):
```css
@import "tailwindcss";

@theme {
  --color-primary-500: #6366f1;
  /* Custom theme variables */
}
```

### Key Differences:
- ✅ No `tailwind.config.js` needed (optional)
- ✅ Use `@theme` directive for customization
- ✅ CSS variables for everything
- ✅ Built-in PostCSS
- ✅ Faster build times

## 📁 Project Structure

```
smranai_frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── teams/
│   │   ├── calendar/
│   │   ├── ai-assistant/
│   │   └── ...
│   ├── components/       # Reusable components
│   │   ├── layout/      # Sidebar, Navbar
│   │   ├── common/      # Buttons, Cards
│   │   ├── modals/      # Modal dialogs
│   │   └── providers/   # Context providers
│   ├── lib/             # Utilities
│   │   ├── api.js       # API client
│   │   └── utils.js     # Helper functions
│   └── store/           # State management
│       └── useStore.js  # Zustand stores
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🎯 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Custom Styles

All custom styles are in `src/app/globals.css`:

```css
/* Glass morphism */
.glass-card { ... }

/* Neon buttons */
.btn-neon { ... }

/* Gradient text */
.gradient-text { ... }

/* Badges */
.badge-high, .badge-medium, .badge-low { ... }
```

## 🌙 Dark Mode

Dark mode is handled by `next-themes`:

```jsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark')  // or 'light' or 'system'
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🔗 API Integration

API client is in `src/lib/api.js`:

```javascript
import { taskAPI } from '@/lib/api'

// Get all tasks
const tasks = await taskAPI.getAll()

// Create task
await taskAPI.create({ title: 'New task' })
```

## 🎭 State Management

Using Zustand for global state:

```javascript
import { useTaskStore } from '@/store/useStore'

const { tasks, setTasks } = useTaskStore()
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Other Platforms
1. Build: `npm run build`
2. Start: `npm start`
3. Set environment variables in platform

## 🔧 Configuration

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Path Aliases (jsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📚 Learn More

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [React 19 Documentation](https://react.dev/)

## 🐛 Troubleshooting

### Module not found errors
```bash
rm -rf node_modules .next
npm install
```

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

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🎉 Ready to Go!

Your frontend is now using the latest technologies:
- Next.js 16 ✅
- React 19 ✅  
- Tailwind CSS v4 ✅

Run `npm run dev` and start building! 🚀
