# Activities Application

A dynamic, aggressive, and colorful Activities management application built with React, TypeScript, and Firebase.

## Features

- **Authentication**: Sign up with name, email, and phone number (default password: MAXOUT)
- **Profile Management**: Change password after initial setup
- **Dynamic Dashboard**: Aggressive color scheme with vibrant gradients
- **Activity Tracking**: Complete sales pipeline management
  - Networking: Add contacts with details and remarks
  - Info: Gather information with A/B/C response ratings
  - Reinfo: Follow-up on info contacts
  - Prospecting: Story sharing and response tracking
  - Invi: Invitation management with skip explanations
  - Plan: Planning and strategy
  - Closing: Deal closure tracking
- **Skip Tracking**: Mandatory explanations when skipping steps
- **Real-time Data**: Firebase Firestore integration
- **Responsive Design**: Works on all device sizes

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore Database
3. Update the Firebase configuration in `src/config/firebase.ts` with your project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Deployment to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Node Version: 18 or higher

## Development

```bash
npm install
npm run dev
```

## Color Scheme

- **Primary**: Electric Blue (#0066FF)
- **Secondary**: Vibrant Orange (#FF6B35)
- **Accent**: Neon Green (#00FF88)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

## Data Flow

1. **Networking** → Add contacts
2. **Info** → Select from Networking contacts, add A/B/C responses
3. **Reinfo** → Follow up on Info contacts
4. **Prospecting** → Select from Info/Reinfo, share stories
5. **Invi** → Send invitations to prospects
6. **Plan** → Strategic planning
7. **Closing** → Final deal closure

All data is stored in Firebase Firestore with user authentication and real-time synchronization.