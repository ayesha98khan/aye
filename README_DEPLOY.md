# JobNest deploy guide

## Backend
1. Copy `backend/.env.example` to `backend/.env`.
2. Fill `MONGODB_URI` and `JWT_SECRET`.
3. SMTP and Cloudinary are optional now. If they are empty:
   - OTP shows in backend logs
   - uploads are stored in `/uploads` locally
4. Start with:
   - `npm install`
   - `npm run start`

## Frontend
1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_URL` to your deployed backend URL.
3. Run:
   - `npm install`
   - `npm run build`

## Notes
- Backend accepts both old and new forgot-password endpoints.
- CORS supports multiple origins by comma-separating `CLIENT_ORIGIN`.
- `MONGODB_DB` is optional.
