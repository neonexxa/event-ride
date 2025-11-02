# Firestore Seeding Guide

This guide explains how to seed your Firestore database with sample data using our robust, auto-detecting seeding script.

## Prerequisites

1. Firebase project with Firestore enabled
2. Node.js installed
3. Firebase Admin SDK service account key

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **carpool-system-12321321**
3. Click the ⚙️ (Settings) icon → **Project Settings**
4. Navigate to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** to download the JSON file
7. Rename the downloaded file to `SA.json`
8. Move it to the project root directory (same level as `package.json`)

**⚠️ IMPORTANT**: Never commit `SA.json` (or `serviceAccountKey.json`) to Git! They're already in `.gitignore`.

## Step 2: Install Dependencies

```bash
npm install
```

This will install both the React dependencies and Firebase Admin SDK.

## Step 3: Run the Seeding Script

### Seed without clearing existing data:

```bash
npm run seed
```

### Seed and clear all existing data first:

```bash
npm run seed:clear
```

**⚠️ WARNING**: `seed:clear` will delete ALL documents from all collections found in your seeding files!

## How the Robust Seeding Works

The seeding script automatically detects and processes all JSON files in the `dummy-data` folder.

### File Naming Convention

Files must follow this pattern: **`{order}_{collection}.json`**

Examples:
- `1000_events.json` → Seeds `events` collection
- `2000_cars.json` → Seeds `cars` collection  
- `3000_participants.json` → Seeds `participants` collection

The script will:
1. Auto-detect all JSON files with numeric prefix
2. Sort them by the prefix number (processing order)
3. Seed each collection in sequence
4. Use custom document IDs if data has an `id` field
5. Auto-generate IDs otherwise

### Current Sample Data

**1000_events.json** - 1 event:
- AirAsia Annual Dinner 2025 (ID: `airasia-annual-dinner-2025`)
- Date: December 15, 2025
- Time: 18:00 - 23:00

**2000_cars.json** - 14 cars:
- All linked to the AirAsia Annual Dinner 2025 event
- Various drivers, meetup points, and seat counts (3-6 seats)

## Adding More Data

### Adding to Existing Collections

Simply edit the existing JSON files in the `dummy-data` folder:

**Edit `dummy-data/1000_events.json`** to add more events:

```json
{
  "id": "unique-event-id",
  "name": "Event Name",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "23:00"
}
```

**Field Descriptions:**
- **id**: Unique identifier (use lowercase, hyphens, no spaces)
- **name**: Display name of the event
- **date**: Event date (YYYY-MM-DD format)
- **startTime**: Event start time (HH:MM 24-hour format)
- **endTime**: Event end time (HH:MM 24-hour format)

**Edit `dummy-data/2000_cars.json`** to add more cars:

```json
{
  "event_id": "unique-event-id",
  "driver_name": "Driver Name",
  "seats_count": 4,
  "depart_time": "10:00 AM",
  "meetup_point": "Location"
}
```

**Field Descriptions:**
- **event_id**: Must match an event ID from 1000_events.json
- **driver_name**: Full name of the driver
- **seats_count**: Number of available seats (integer)
- **depart_time**: Departure time (string, any format)
- **meetup_point**: Meeting location description

### Adding New Collections

To add a completely new collection, create a new JSON file with the proper naming:

**Example: Add participants collection**

Create file: `dummy-data/3000_participants.json`

```json
[
  {
    "car_id": "car-document-id",
    "seat_number": 1,
    "passenger_name": "Jane Smith",
    "passenger_email": "jane@example.com",
    "pickup_point": "Main Street"
  }
]
```

Then run `npm run seed` - the script will automatically detect and seed it!

**Naming Tips:**
- Use numbers that maintain proper order (1000, 2000, 3000...)
- Leave gaps (use 1000, 2000 instead of 1, 2) for future insertions
- Collection name should match your Firestore collection exactly

## Verify Data in Firestore

After seeding:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Firestore Database**
3. Check the `events` and `cars` collections
4. You should see all seeded documents
5. The script output shows exactly what was created

## Troubleshooting

### Error: SA.json not found

Make sure you've downloaded and placed the service account key in the project root as `SA.json`.

### Error: Permission denied

Ensure your service account has Firestore write permissions. The default Firebase Admin SDK key should have all necessary permissions.

### Error: FIREBASE_CONFIG not set

This error is for the React app, not the seeding script. Make sure you've updated `src/firebase.js` with your web app configuration (different from the service account key).

### Seeding completes but no data appears

- Check the console output for error messages
- Verify you're looking at the correct Firestore project in Firebase Console
- Check Firestore Rules - make sure write access is allowed for the service account

## Clean Up

To remove all seeded data:

```bash
npm run seed:clear
```

Then skip the seeding by pressing `Ctrl+C` when prompted, or let it seed fresh data.

## Production Considerations

- **Never** commit `serviceAccountKey.json` to version control
- Consider using environment variables for production deployments
- Implement proper authentication and authorization in your app
- Set up Firestore Security Rules to protect your data

## Security Best Practices

1. Keep `SA.json` private and secure
2. Don't share it in chat, email, or public repositories
3. Rotate keys periodically
4. Use different service accounts for different environments (dev/staging/prod)
5. Delete unused service account keys

## Need Help?

If you encounter issues:
1. Check the error message in the console
2. Verify all prerequisites are met
3. Ensure you're using the correct project ID
4. Check Firebase Console for any project-level issues

