# Changelog

All notable changes to the Carpool Seat Selection System.

## [2.0.0] - 2024-11-02

### 🚀 Major Changes - Robust Seeding System

#### Added
- **Robust Auto-Detecting Seeding Script**: Script now automatically detects and processes all JSON files in `dummy-data/` folder
- **Unix Epoch Time Ordering**: Files use numeric prefixes (1000, 2000, 3000...) to control seeding order
- **Events Collection**: New `/events` collection for managing event details
  - Custom document IDs (e.g., `airasia-annual-dinner-2025`)
  - Fields: id, name, date, startTime, endTime
- **Service Account Key Support**: Uses `SA.json` for Firebase Admin SDK authentication
- **Auto ID Generation**: Intelligently uses custom IDs when available, auto-generates otherwise

#### Changed
- **File Naming Convention**: 
  - `events.json` → `1000_events.json`
  - `cars.json` → `2000_cars.json`
- **Cars Collection**: `event_id` now references actual event document IDs (not event names)
- **React App**: Event dropdown now shows full event details (name, date, time)
- **Documentation**: Complete rewrite of SEEDING.md with new conventions

#### Benefits
- ✅ Add new collections without modifying seed script
- ✅ Control seeding order with file prefixes
- ✅ Clear visual ordering in file explorer
- ✅ Future-proof for additional collections
- ✅ Self-documenting file names

### Example: Adding New Collection

Before (Required script modification):
```javascript
// Had to edit seed-firestore.js to add new collection
const participantsData = require('./dummy-data/participants.json');
// ... add seeding logic
```

After (No script modification needed):
```bash
# Just create a new file with proper naming:
touch dummy-data/3000_participants.json
# Add your data, then run:
npm run seed
```

## [1.0.0] - 2024-11-01

### Initial Release

#### Features
- Single-page React carpool seat selection system
- Firestore integration
- Movie-ticket-style seat selection UI
- Event dropdown selector
- Real-time seat availability
- Booking and cancellation functionality
- Google App Engine deployment support
- Sample data seeding script

#### Collections
- `cars` - Car listings with drivers and seats
- `participants` - Passenger bookings

#### Tech Stack
- React 18
- Firebase/Firestore 10.7.1
- Firebase Admin 13.5.0
- Google App Engine (Node.js 18)

---

## Migration Guide: v1.0 → v2.0

If you have existing v1.0 setup:

1. **Rename data files** in `dummy-data/`:
   ```bash
   mv events.json 1000_events.json
   mv cars.json 2000_cars.json
   ```

2. **Update your `seed-firestore.js`** with the new version from the repo

3. **Update event_id references**: If you have existing cars with event names as IDs, update them to use the new event IDs format

4. **Re-seed your database**:
   ```bash
   npm run seed:clear
   ```

5. **Update React app** to fetch from `/events` collection (already done in v2.0)

