# Carpool Seat Selection System

A simple React-based carpool seat selection system for events, integrated with Google Cloud Firestore and deployable to Google App Engine.

## Features

- 🎯 Event selection dropdown
- 🚗 Visual seat selection interface (similar to movie ticket booking)
- ⚡ **Real-time seat updates** - See bookings/cancellations instantly across all devices
- 💺 Book and cancel seats
- 📱 Responsive design
- ☁️ Google Cloud Firestore integration with live listeners

## Prerequisites

- Node.js (v22 or higher) - Required by Firebase
- Google Cloud SDK (`gcloud` CLI) - Optional, for App Engine deployment
- Firebase project setup

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Edit `src/firebase.js` and replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "carpool-system-12321321.firebaseapp.com",
  projectId: "carpool-system-12321321",
  storageBucket: "carpool-system-12321321.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

You can find these values in your Firebase Console:
1. Go to Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section

### 3. Seed Sample Data (Optional but Recommended)

To quickly populate your Firestore database with sample data:

```bash
npm run seed
```

The seeding script automatically detects all JSON files in `dummy-data/` and seeds them in order. No need to modify the script when adding new collections!

For detailed instructions, see [SEEDING.md](SEEDING.md)

**Note**: You'll need a Firebase service account key (SA.json). See the seeding guide for details.

### 4. Firestore Database Structure

#### Events Collection (`/events`)

```
{
  id: "custom-event-id",  // e.g., "airasia-annual-dinner-2025"
  name: "AirAsia Annual Dinner 2025",
  date: "2025-12-15",
  startTime: "18:00",
  endTime: "23:00"
}
```

#### Cars Collection (`/cars`)

```
{
  id: "auto-generated",
  event_id: "airasia-annual-dinner-2025",  // references event document ID
  driver_name: "John Doe",
  seats_count: 4,
  depart_time: "10:00 AM",
  meetup_point: "Office Lobby"
}
```

#### Participants Collection (`/participants`)

```
{
  id: "auto-generated",
  car_id: "reference-to-car-id",
  seat_number: 1,
  passenger_name: "Jane Smith",
  passenger_email: "jane@example.com",
  pickup_point: "Main Street"
}
```

### 5. Create Firestore Indexes (if needed)

The app queries Firestore by `event_id`. If you encounter index errors, Firestore will provide a link to create the required index.

## Development

Run the app locally:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

This creates a `build` directory with optimized production files.

## Deployment

### Option 1: Netlify (Recommended - Easiest)

1. **Push code to GitHub**
2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Deploy! (auto-detected from `netlify.toml`)

For detailed instructions, see [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)

**Benefits**:
- ✅ Automatic deployments on Git push
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Preview deployments for PRs

### Option 2: Google App Engine

1. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project carpool-system-12321321
   ```

2. **Build and deploy**
   ```bash
   npm run build
   gcloud app deploy
   ```

3. **View your app**
   ```bash
   gcloud app browse
   ```

## Project Structure

```
carpool-to-events/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling
│   ├── firebase.js     # Firebase configuration
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── app.yaml            # App Engine configuration
├── package.json        # Dependencies and scripts
└── README.md
```

## How It Works

1. **Event Selection**: Users select an event from the dropdown
2. **View Cars**: All cars for the selected event are displayed in a grid (max 3 per row)
3. **Real-Time Updates**: App listens to Firestore changes - all users see updates instantly
4. **Seat Selection**: Click on an available seat to book it
5. **Booking Form**: Fill in passenger details (name, email, pickup point)
6. **Instant Feedback**: Seat is marked as occupied immediately for all users
7. **Cancellation**: Click on an occupied seat to cancel the booking

**✨ Real-Time Magic**: When someone books a seat, everyone viewing that event sees it update **instantly** without refreshing! See [REALTIME_FEATURES.md](REALTIME_FEATURES.md) for technical details.

## Configuration Files

- **netlify.toml**: Netlify deployment configuration (build settings, redirects, headers)
- **public/_redirects**: SPA routing configuration for Netlify
- **app.yaml**: Google App Engine configuration (alternative deployment)
- **.gcloudignore**: Specifies files to exclude from App Engine deployment
- **package.json**: Node.js dependencies and scripts

## Firestore Security Rules (Recommended)

Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if false; // Only allow through backend/admin
    }
    
    match /participants/{participantId} {
      allow read: if true;
      allow create: if true;
      allow delete: if true;
      allow update: if false;
    }
  }
}
```

## Troubleshooting

### Firebase Configuration Issues
- Make sure you've replaced all placeholder values in `src/firebase.js`
- Verify your Firebase project ID matches in both `firebase.js` and `app.yaml`

### Deployment Issues
- Ensure you're authenticated: `gcloud auth login`
- Check project ID: `gcloud config get-value project`
- Make sure you've built the app: `npm run build`

### Firestore Index Errors
- Click the link in the error message to create the required index
- Wait a few minutes for the index to build

## License

MIT

## Support

For issues or questions, please contact your development team.

