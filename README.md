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

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
