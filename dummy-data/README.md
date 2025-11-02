# Sample Data Overview

This directory contains sample data for seeding the Firestore database.

## File Naming Convention

All JSON files must follow this pattern: `{order}_{collection}.json`

- **{order}**: Unix epoch time or sequential number (determines processing order)
- **{collection}**: Firestore collection name

### Example:
- `1000_events.json` → Seeds the `events` collection first
- `2000_cars.json` → Seeds the `cars` collection second
- `3000_participants.json` → Seeds the `participants` collection third

**Why this pattern?**
- Collections are seeded in the correct order (events before cars)
- No need to modify the seeding script when adding new collections
- Clear visual ordering when viewing files

## Current Data Files

### 1000_events.json

Contains 1 sample event:

| ID | Name | Date | Start Time | End Time |
|----|------|------|------------|----------|
| airasia-annual-dinner-2025 | AirAsia Annual Dinner 2025 | 2025-12-15 | 18:00 | 23:00 |

**Structure:**
```json
{
  "id": "airasia-annual-dinner-2025",
  "name": "AirAsia Annual Dinner 2025",
  "date": "2025-12-15",
  "startTime": "18:00",
  "endTime": "23:00"
}
```

### 2000_cars.json

Contains 14 sample cars, all linked to the AirAsia Annual Dinner 2025 event:

| Driver | Seats | Depart Time | Meetup Point |
|--------|-------|-------------|--------------|
| Ahmad Ibrahim | 4 | 6:00 PM | RedQ Main Lobby |
| Sarah Tan | 3 | 6:15 PM | RedQ Parking Lot A |
| Kumar Raj | 5 | 6:00 PM | RedQ Main Lobby |
| Michelle Wong | 4 | 6:30 PM | RedQ Parking Lot B |
| David Lee | 4 | 6:00 PM | KL Sentral |
| Nurul Aisyah | 6 | 6:00 PM | RedQ Main Entrance |
| James Lim | 3 | 6:30 PM | Bangsar LRT |
| Siti Nurhaliza | 4 | 5:30 PM | KLCC Convention Centre |
| Rahman Ali | 5 | 5:30 PM | RedQ Main Lobby |
| Lisa Chen | 3 | 5:45 PM | Pavilion KL |
| Alex Tan | 4 | 6:00 PM | Titiwangsa Lake Garden |
| Farah Ahmad | 5 | 6:00 PM | RedQ Main Gate |
| Marcus Chong | 3 | 6:15 PM | RedQ Parking Lot A |
| Priya Sharma | 4 | 6:30 PM | Mid Valley Megamall |

**Structure:**
```json
{
  "event_id": "airasia-annual-dinner-2025",
  "driver_name": "Ahmad Ibrahim",
  "seats_count": 4,
  "depart_time": "6:00 PM",
  "meetup_point": "RedQ Main Lobby"
}
```

**Note**: Cars don't have an `id` field, so Firestore auto-generates document IDs.

## How the Seeding Works

### With Custom Document IDs
If your data includes an `id` field, the seeding script will use it as the document ID:

```json
// 1000_events.json
[
  {
    "id": "my-custom-id",
    "name": "Event Name",
    ...
  }
]
```
→ Creates document at `/events/my-custom-id`

### With Auto-Generated IDs
If your data doesn't include an `id` field, Firestore generates a random ID:

```json
// 2000_cars.json
[
  {
    "driver_name": "John Doe",
    "seats_count": 4,
    ...
  }
]
```
→ Creates document at `/cars/{auto-generated-id}`

## Adding New Collections

To add a new collection, simply create a new JSON file with the proper naming:

### Example: Add participants collection

**File**: `3000_participants.json`

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

Then run: `npm run seed`

The script will automatically detect and seed the new collection!

## Adding New Events

To add more events, edit `1000_events.json`:

```json
[
  {
    "id": "airasia-annual-dinner-2025",
    "name": "AirAsia Annual Dinner 2025",
    "date": "2025-12-15",
    "startTime": "18:00",
    "endTime": "23:00"
  },
  {
    "id": "team-building-genting-2025",
    "name": "Team Building Retreat - Genting",
    "date": "2025-08-20",
    "startTime": "08:00",
    "endTime": "18:00"
  }
]
```

### Best Practices:
- Use kebab-case for event IDs (lowercase with hyphens)
- Keep event IDs URL-friendly
- Use ISO date format (YYYY-MM-DD)
- Use 24-hour time format (HH:MM)

## Database Collections Structure

### Events Collection (`/events`)
```
{
  id: "custom-event-id" (from data),
  name: string,
  date: string (YYYY-MM-DD),
  startTime: string (HH:MM),
  endTime: string (HH:MM),
  created_at: timestamp (auto-added)
}
```

### Cars Collection (`/cars`)
```
{
  id: "auto-generated",
  event_id: string (references event ID),
  driver_name: string,
  seats_count: number,
  depart_time: string,
  meetup_point: string,
  created_at: timestamp (auto-added)
}
```

### Participants Collection (`/participants`)
```
{
  id: "auto-generated",
  car_id: string (references car ID),
  seat_number: number,
  passenger_name: string,
  passenger_email: string,
  pickup_point: string,
  created_at: timestamp (auto-added)
}
```

## Tips

1. **Order matters**: Events should be seeded before cars (cars reference events)
2. **Use meaningful prefixes**: 1000, 2000, 3000... leaves room for insertions
3. **JSON validation**: Ensure your JSON is valid before seeding
4. **Test with small data**: Start with 1-2 records to test your structure
5. **Backup before clear**: `--clear` flag deletes all data!

## Future Enhancements

Potential collections to add:
- `1500_event_categories.json` - Event types/categories
- `2500_drivers.json` - Driver profiles
- `3000_participants.json` - Pre-booked passengers
- `4000_routes.json` - Common routes and directions
- `5000_reviews.json` - Driver/passenger ratings

The robust seeding script will handle them automatically! 🚀
