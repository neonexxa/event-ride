# System Architecture

## Overview

Simple React-based carpool seat selection system with Firestore backend and robust auto-seeding.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                           │
│                   (React Single Page)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Firebase SDK
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   FIRESTORE DATABASE                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   /events    │  │    /cars     │  │ /participants │     │
│  │              │  │              │  │               │     │
│  │ - id (custom)│  │ - id (auto)  │  │ - id (auto)   │     │
│  │ - name       │  │ - event_id ─┼──┼─▶             │     │
│  │ - date       │  │ - driver     │  │ - car_id ─────┼──┐  │
│  │ - startTime  │  │ - seats      │  │ - passenger   │  │  │
│  │ - endTime    │  │ - meetup     │  │ - email       │  │  │
│  └──────────────┘  └──────┬───────┘  └───────────────┘  │  │
│                           │                              │  │
│                           └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ▲
                        │
                        │ Firebase Admin SDK
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                   SEEDING SCRIPT                             │
│                  (seed-firestore.js)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Auto-detects JSON files in dummy-data/            │    │
│  │  Pattern: {order}_{collection}.json                │    │
│  │                                                     │    │
│  │  1000_events.json      → /events                   │    │
│  │  2000_cars.json        → /cars                     │    │
│  │  3000_participants.json → /participants            │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Seeding Flow
```
Developer creates JSON file
         ↓
Named with pattern: {order}_{collection}.json
         ↓
Run: npm run seed
         ↓
Script auto-detects files
         ↓
Sorts by numeric prefix
         ↓
Seeds each collection in order
         ↓
Data appears in Firestore
```

### 2. User Booking Flow
```
User opens app
         ↓
App fetches events from /events
         ↓
User selects event
         ↓
App fetches cars where event_id = selected event
         ↓
App fetches participants for those cars
         ↓
Display available/occupied seats
         ↓
User clicks available seat
         ↓
Booking form appears
         ↓
User submits form
         ↓
Create document in /participants
         ↓
Refresh participants list
         ↓
Seat shows as occupied
```

### 3. Cancellation Flow
```
User clicks occupied seat
         ↓
Confirmation dialog
         ↓
User confirms
         ↓
Delete document from /participants
         ↓
Refresh participants list
         ↓
Seat shows as available
```

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework (no additional frameworks like Next.js)
- **Firebase SDK 10.7.1** - Client-side Firestore access
- **Vanilla CSS** - Styling with modern gradients and animations

### Backend
- **Google Firestore** - NoSQL database
- **Firebase Admin SDK 13.5.0** - Server-side operations (seeding)

### Deployment
- **Google App Engine** - Serverless hosting for React build
- **Node.js 18** - Runtime environment

### Development
- **React Scripts 5.0.1** - Build tooling
- **Node.js** - Local development

## File Structure

```
carpool-to-events/
├── dummy-data/                    # Seed data
│   ├── 1000_events.json          # Events (seeded first)
│   ├── 2000_cars.json            # Cars (seeded second)
│   ├── EXAMPLE_*.json.txt        # Example files for reference
│   └── README.md                 # Data documentation
│
├── public/                        # Static assets
│   └── index.html                # HTML entry point
│
├── src/                          # React application
│   ├── App.js                    # Main component
│   ├── App.css                   # Component styles
│   ├── firebase.js               # Firebase config
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles
│
├── seed-firestore.js             # Robust seeding script
├── app.yaml                      # App Engine config
├── package.json                  # Dependencies
├── SA.json                       # Service account key (gitignored)
├── README.md                     # Main documentation
├── SEEDING.md                    # Seeding guide
├── ARCHITECTURE.md               # This file
└── CHANGELOG.md                  # Version history
```

## Seeding System Architecture

### Design Principles

1. **Auto-Detection**: Script scans `dummy-data/` folder
2. **Convention over Configuration**: File naming determines behavior
3. **Sequential Processing**: Numeric prefix controls order
4. **Intelligent ID Handling**: Uses custom IDs when available
5. **Zero Code Changes**: Add collections without modifying script

### Pattern Matching

```javascript
// Valid filenames:
1000_events.json       ✓
2000_cars.json         ✓
3000_participants.json ✓
15_users.json          ✓

// Invalid filenames:
events.json            ✗ (no prefix)
1000events.json        ✗ (no underscore)
1000_events.txt        ✗ (not .json)
```

### Processing Algorithm

```
1. Read all files in dummy-data/
2. Filter files matching: /^(\d+)_(.+)\.json$/
3. Extract: order number, collection name
4. Sort by order number (ascending)
5. For each file:
   a. Read JSON data
   b. For each item:
      - If has 'id' field: use as document ID
      - Else: auto-generate ID
   c. Add 'created_at' timestamp
   d. Write to Firestore
6. Report statistics
```

## Security Architecture

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - Read only (managed by admin)
    match /events/{eventId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Cars - Read only (managed by admin)
    match /cars/{carId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Participants - Anyone can book/cancel
    match /participants/{participantId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'car_id', 'seat_number', 'passenger_name', 
        'passenger_email', 'pickup_point'
      ]);
      allow delete: if true;
      allow update: if false;
    }
  }
}
```

### Key Security Points

1. **Service Account**: SA.json kept private (in .gitignore)
2. **Read-Only Collections**: Events and cars can't be modified by users
3. **Validation**: Participants require all fields
4. **No Updates**: Participants can only be created or deleted (no edits)

## Scalability Considerations

### Current Design
- **Single event selection**: UI loads one event at a time
- **Client-side filtering**: Participants filtered in browser
- **No pagination**: All cars for an event loaded at once

### Future Enhancements

1. **Pagination**: Load cars in batches for events with many cars
2. **Real-time Updates**: Use Firestore snapshots for live seat availability
3. **Caching**: Cache event list client-side
4. **Indexes**: Add composite indexes for common queries
5. **Cloud Functions**: Add server-side validation

### Performance Notes

- **Events query**: Scans entire /events collection (OK for small number of events)
- **Cars query**: Filtered by event_id (needs index if many events)
- **Participants query**: Scans all participants (consider filtering by car_id)

## Deployment Architecture

```
Developer Machine
       ↓
   npm run build
       ↓
   Creates /build folder with static files
       ↓
   gcloud app deploy
       ↓
   Uploads to GCP
       ↓
   App Engine serves static files
       ↓
   Users access via URL
       ↓
   Browser makes direct calls to Firestore
   (no server-side API needed)
```

### Why App Engine?

- ✅ Simple deployment for static sites
- ✅ Auto-scaling
- ✅ HTTPS by default
- ✅ Custom domain support
- ✅ No server management

### Alternative Deployments

- **Firebase Hosting**: Even simpler for static sites
- **Cloud Run**: If you add Node.js backend
- **GKE**: Overkill for this use case

## Future Architecture Options

### Option 1: Add Cloud Functions

```
React App → Cloud Function → Firestore
          ↓
    Email notifications
    Validation
    Business logic
```

### Option 2: Add Authentication

```
React App → Firebase Auth → Firestore
          ↓
    User profiles
    Role-based access
    Booking history
```

### Option 3: Add Analytics

```
Firestore → BigQuery → Data Studio
          ↓
    Booking trends
    Popular events
    Usage metrics
```

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm start           # Run dev server (port 3000)
# Edit files - hot reload enabled
```

### Seeding
```bash
npm run seed        # Seed data (additive)
npm run seed:clear  # Clear + seed (destructive)
```

### Deployment
```bash
npm run build       # Create production build
npm run deploy      # Deploy to App Engine
```

### Testing Sequence
```bash
1. Update dummy-data JSON files
2. npm run seed:clear
3. npm start
4. Test in browser (http://localhost:3000)
5. npm run build
6. npm run deploy
7. Test in production
```

## Monitoring & Debugging

### Firestore Console
- View real-time data
- Monitor read/write operations
- Check security rules

### Browser DevTools
- React DevTools for component inspection
- Network tab for Firestore requests
- Console for error messages

### App Engine Logs
- Access via GCP Console
- View deployment logs
- Monitor traffic

## Best Practices

### Data Management
- ✅ Use meaningful event IDs (kebab-case)
- ✅ Keep events collection small (under 1000 events)
- ✅ Archive old events instead of deleting
- ✅ Validate data before seeding

### Code Management
- ✅ Don't commit SA.json
- ✅ Use environment variables for configs
- ✅ Keep React components small and focused
- ✅ Add PropTypes for type checking

### Deployment
- ✅ Test locally before deploying
- ✅ Use separate Firebase projects for dev/prod
- ✅ Back up Firestore before major changes
- ✅ Monitor Firestore usage quotas

