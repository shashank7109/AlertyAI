# 🚀 RUN THIS - Quick Start Commands

## Start Development Server

```powershell
# Open PowerShell in this directory (C:\Smranai\smranai_frontend)

# Run the dev server
npm run dev

# Server will start on: http://localhost:3000
```

That's it! ✅

---

## Full Setup (First Time Only)

If you haven't run `npm install` yet:

```powershell
# 1. Install dependencies (first time only)
npm install

# 2. Start dev server
npm run dev

# Done! Open http://localhost:3000
```

---

## Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Common Commands

```powershell
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Kill port 3000 if busy
npx kill-port 3000
```

---

## If You Get Errors

### Module not found
```powershell
Remove-Item -Recurse -Force node_modules,.next
npm install
```

### Port already in use
```powershell
npx kill-port 3000
npm run dev
```

### Backend not connecting
1. Check backend is running: http://localhost:8000/docs
2. Check .env.local has correct API URL
3. Restart both servers

---

## Project Status

✅ All dependencies installed  
✅ Next.js 16 configured  
✅ React 19 ready  
✅ Tailwind CSS v4 setup  
✅ All components migrated  
✅ Environment variables set  

**Status**: READY TO RUN! 🎉

---

Just run: `npm run dev` 🚀

