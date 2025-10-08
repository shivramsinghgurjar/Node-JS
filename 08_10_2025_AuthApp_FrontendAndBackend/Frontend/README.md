# AuthApp Frontend (Vite + React)

## Setup (quick)

1. Ensure your backend is running at `http://localhost:5000` (or update `.env`).
2. From the `Frontend` folder:

```bash
npm install
npm run dev
```

3. Open `http://localhost:5173` (Vite default).

## Notes

- API base URL is taken from `.env` -> `VITE_API_URL`. Default is `http://localhost:5000/api/v1`.
- The frontend uses an Authorization: Bearer <token> header. After login/register the returned token is stored in localStorage and attached to future requests.
- If you prefer cookie-based auth only, set `api` to `withCredentials: true` and update backend CORS to include `credentials: true` and correct `origin`.

---

End of frontend code. If you want, I can:

- add Tailwind / nicer UI
- wire up a deploy-ready build
- make the frontend call the backend logout endpoint on logout (currently we call it from context, but you can change behavior)
