# 🚀 Quick Setup - Smaran AI Frontend

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ Backend running on `http://localhost:8000`
- ✅ MongoDB running

---

## 📦 Step 1: Install Dependencies

```bash
npm install
```

---

## 🔧 Step 2: Create Environment File

**Create `.env.local` file in this directory:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_APP_NAME=Smaran AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Quick command:**
```bash
# Copy template
cp env.template .env.local

# Edit with your values
# Linux/Mac:
nano .env.local

# Windows:
notepad .env.local
```

---

## 🔐 Step 3: Google OAuth (Optional)

If you want Google Sign-In to work:

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add to authorized origins:
   - `http://localhost:3000`
   - `http://localhost:8000`
4. Add to redirect URIs:
   - `http://localhost:8000/api/oauth/google/callback`
5. Copy Client ID to `.env.local`
6. Copy Client Secret to backend `.env`

**Skip this if you only want email/password login!**

---

## ▶️ Step 4: Run Development Server

```bash
npm run dev
```

**Frontend will start on:** http://localhost:3000

---

## ✅ Step 5: Test It!

### Create Account:
1. Open http://localhost:3000/register
2. Fill form and submit
3. Redirected to login

### Login:
1. Open http://localhost:3000/login
2. Enter credentials
3. Redirected to dashboard

### Use the App:
- ✅ Dashboard: http://localhost:3000/dashboard
- ✅ Tasks: http://localhost:3000/tasks
- ✅ Later Box: http://localhost:3000/laterbox
- ✅ Opportunities: http://localhost:3000/opportunities
- ✅ Teams: http://localhost:3000/teams
- ✅ Calendar: http://localhost:3000/calendar

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
→ Make sure backend is running on port 8000
```bash
curl http://localhost:8000/health
```

### "Module not found"
→ Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Google login not working"
→ Check Google OAuth setup or skip and use email/password

---

## 📁 Project Structure

```
smranai_frontend/
├── .env.local          ← Create this! (from env.template)
├── src/
│   ├── app/            ← Pages (Next.js 13+ App Router)
│   ├── components/     ← Reusable components
│   ├── lib/
│   │   └── api.js      ← All API calls
│   └── store/          ← Zustand state management
├── public/             ← Static assets
└── package.json        ← Dependencies
```

---

## 🎨 Features Available

- ✅ Email/Password Authentication
- ✅ Google OAuth Sign-In (if configured)
- ✅ Task Management (CRUD)
- ✅ Later Box (Ideas & Resources)
- ✅ Opportunities Tracking
- ✅ Team Collaboration
- ✅ AI Assistant Integration
- ✅ Calendar View
- ✅ Image Upload for Task Extraction
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Multi-language Support (coming soon)

---

## 🚀 Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📝 Environment Variables Explained

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | No | `123456-abc.apps.googleusercontent.com` |
| `NEXT_PUBLIC_APP_NAME` | Application Name | No | `Smaran AI` |
| `NEXT_PUBLIC_APP_VERSION` | App Version | No | `1.0.0` |

---

## ✨ What's New

### ✅ Removed All Dummy Data
- Tasks now fetch from real API
- Later Box connects to backend
- Opportunities use actual data
- Teams fetch from database
- Dashboard shows real stats

### ✅ Real Authentication
- JWT token-based auth
- Persistent login (localStorage)
- Auto-redirect if not authenticated
- Google OAuth integration
- Token refresh support

### ✅ API Integration
- All pages connected to backend
- Proper error handling
- Loading states everywhere
- MongoDB field mapping

---

## 📞 Support

- Documentation: See `FRONTEND_DEPLOYMENT_GUIDE.md`
- Backend Setup: See `../backend/SETUP_GUIDE.md`
- Issues: Check browser console and backend logs

---

**That's it! You're ready to use Smaran AI! 🎉**

