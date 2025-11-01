# AI Fitness Coach - Minimal Pages Router Scaffold

This is a minimal Next.js (pages router) scaffold for the AI Fitness Coach app.
It includes:
- pages router structure (pages/, pages/api/)
- Auth context (context/AuthContext.jsx)
- Example API routes for AI generation and TTS calls (server-side)
- Client utilities to export plan as PDF (utils/pdf.js)
- Minimal components (Header, ChatUI)

How to run:
1. Copy `.env.example` to `.env.local` and fill keys.
2. npm install
3. npm run dev

Deploy to Vercel:
- Set env vars in Vercel project settings.
- Build command: `npm run build`
- Output directory: (leave default)
