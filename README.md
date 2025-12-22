# GCS 2026

## How to Install
1. First clone the repo

2. Run the following
```bash
cd gcs_2026

npm install

npm install leaflet react-leaflet

npm install react-router-dom

npm i lucide-react

```

## How to use
1. Open up a new terminal and run:
```bash
export VITE_BACKEND_URL=http://localhost:8000
npm run dev
```

2. At the same time, open another terminal and run:
```bash
uvicorn server.main:app --reload --port 8000
```

or

```bash
python3 -m uvicorn server.main:app --reload --port 8000
```