# Dijkstra Demo

## Local development

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`.
2. Start the API from `backend` with `npm install` and `npm start`.
3. Copy `frontend/.env.example` to `frontend/.env.local` if you need a custom API URL.
4. Start the React app from `frontend` with `npm install` and `npm start`.

The frontend uses `http://localhost:5000` in development and the Render URL in production unless `REACT_APP_API_BASE_URL` is set.

## Deployment

### Backend on Render

Create a **Web Service** for this repository with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
	- `MONGO_URI`: the MongoDB connection string for the deployment database
	- `FRONTEND_URL`: `https://venilashree.github.io`
	- `PORT`: leave unset so Render can provide it

The API listens on `0.0.0.0` and exposes `GET /api/health` for health checks. Add the Render service URL to MongoDB Atlas Network Access if Atlas requires an allowlist.

### Frontend on GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the `frontend` folder and publishes it to GitHub Pages. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. The workflow defaults to the configured Render URL; a repository variable named `REACT_APP_API_BASE_URL` can override it.

Never commit `backend/.env` or any file containing database credentials. Rotate the MongoDB password if a real credential has already been pushed to Git history.