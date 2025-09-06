# Interior Design Project

## Deployment Instructions

### Frontend Deployment (Vercel)

1. **Prepare your repository**
   - Make sure your code is pushed to a GitHub repository

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com) and sign in with your GitHub account
   - Click "New Project" and import your repository
   - Select the Frontend directory as the root directory
   - Vercel will automatically detect the Vite framework
   - Click "Deploy"

3. **Environment Variables**
   - After deployment, go to your project settings
   - Add any necessary environment variables (like API URLs)

### Backend Deployment (Vercel)

1. **Prepare your repository**
   - Make sure your code is pushed to a GitHub repository

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com) and sign in with your GitHub account
   - Click "New Project" and import your repository
   - Select the backend directory as the root directory
   - Vercel will automatically detect the Node.js project
   - Click "Deploy"

3. **Environment Variables**
   - After deployment, go to your project settings
   - Add all required environment variables from your .env file:
     - MONGODB_URI (already configured with your MongoDB Atlas connection)
     - JWT_SECRET
     - NODE_ENV (set to "production")
     - Add the frontend URL to FRONTEND_URL for CORS

4. **Connect Frontend to Backend**
   - Update the API URL in your frontend code to point to your deployed backend URL

## Local Development

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Project Structure

- `Frontend/` - React frontend built with Vite
- `backend/` - Express.js backend API