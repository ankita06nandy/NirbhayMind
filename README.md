# React + Vite

## Backend

The backend is in [`backend/`](./backend). It reads the public Google Sheet dataset,
normalizes case and well-being records, and exposes dashboard APIs for the frontend.

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The API starts on `http://localhost:4000`. The main frontend endpoint is:

`GET /api/v1/dashboard/V1001`

Run the backend before signing in. From the repository root, use
`npm run dev:backend`; the Vite development server proxies `/api` requests to
`http://localhost:4000`. For a separate frontend API host, set
`VITE_API_URL` before starting Vite.

Chat uses Google's Gemini model. Set `GEMINI_API_KEY` in `backend/.env` (and
optionally `GEMINI_MODEL`) before using the Chat with AI screen. The key stays
on the backend and is never exposed to the browser. The value must be an active
Google AI Studio API key, not the placeholder from `.env.example`; restart the
backend after changing it.

Submit a mood check-in with `POST /api/v1/victims/V1001/checkins` and a JSON body
containing `mood`, `stress`, `anxiety`, and `sleep` using the labels shown in the
Mood Check screen. New check-ins are stored in `backend/data/checkins.json`, while
the Google Sheet remains read-only. Use `POST /api/dataset/sync` to refresh the
dataset without restarting the server.

In a second terminal, run the existing frontend:

```powershell
npm install
$env:VITE_API_URL="http://localhost:4000"
npm run dev
```

Open the Vite URL shown in the terminal. The frontend uses victim `V1001` by
default; change the `victimId` constant in [`src/App.jsx`](./src/App.jsx) when
connecting a different authenticated user.

Available endpoints:

- `GET /api/health`
- `GET /api/v1/dashboard/:victimId`
- `GET /api/v1/victims/:victimId/case`
- `GET /api/v1/victims/:victimId/checkins`
- `POST /api/v1/victims/:victimId/checkins`
- `POST /api/dataset/sync`
- `POST /api/v1/chat`

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
