# CiptaanKu - Product Lab

A modern, premium product showcase platform with Firebase integration.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase credentials:
   ```ini
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **IMPORTANT**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

### 3. Run Development Server
```bash
npm run dev
```

## Firebase Collections

- **CKProducts**: Stores all product showcase data with real-time synchronization

## Security Notes

- All Firebase credentials are stored in environment variables
- The `.env` file is excluded from Git to prevent credential exposure
- Use `.env.example` as a template for setting up new environments
