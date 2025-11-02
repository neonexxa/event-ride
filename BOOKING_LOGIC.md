# Booking Logic Documentation

## Overview

The carpool system implements intelligent booking logic to prevent duplicate bookings and manage seat changes efficiently.

## Core Business Rules

### Rule 1: One Booking Per Email Per Event

Each email address can only have **one active booking** per event. This prevents:
- Accidental double bookings
- Hogging multiple seats
- Confusion about which car to join

### Rule 2: Automatic Seat Moving

If a user books a new seat while already having a booking:
1. System detects existing booking by `event_id` + `passenger_email`
2. Prompts user to confirm seat change
3. If confirmed: Old booking deleted, new booking created
4. If cancelled: Keep existing booking, abort new booking

## Data Structure

### Participants Collection

Each participant document contains:

```javascript
{
  id: "auto-generated-id",
  event_id: "airasia-annual-dinner-2025",  // Links to event
  car_id: "car-document-id",                // Links to car
  seat_number: 1,                           // Seat position in car
  passenger_name: "Jane Smith",
  passenger_email: "jane@airasia.com",      // Unique per event
  pickup_point: "RedQ Main Lobby"
}
```

### Key Field: event_id

Adding `event_id` enables:
- ✅ Query bookings per event
- ✅ Enforce one booking per email per event
- ✅ Efficient filtering in real-time listeners
- ✅ Support multiple events simultaneously

## Booking Flow

### New Booking (User has no existing booking)

```
User clicks available seat
       ↓
Fills booking form
       ↓
Submits form
       ↓
System queries: WHERE event_id = X AND passenger_email = Y
       ↓
No results found
       ↓
Create new participant document
       ↓
Seat shows as occupied (real-time)
       ↓
Success message shown
```

### Moving Booking (User already has a booking)

```
User clicks available seat
       ↓
Fills booking form (same email)
       ↓
Submits form
       ↓
System queries: WHERE event_id = X AND passenger_email = Y
       ↓
Existing booking found!
       ↓
Show confirmation dialog:
"You already have a booking for this event
(Driver Name - Seat X).
Do you want to move to the new seat?"
       ↓
   User confirms?
   ├─ YES ─→ Delete old booking
   │         Create new booking
   │         Old seat becomes available (real-time)
   │         New seat becomes occupied (real-time)
   │         Success: "Booking moved to new seat!"
   │
   └─ NO ──→ Cancel operation
             Keep existing booking
             Close modal
```

## Implementation Details

### Check for Existing Booking

```javascript
const existingBookingQuery = query(
  collection(db, 'participants'),
  where('event_id', '==', selectedEvent),
  where('passenger_email', '==', formData.passenger_email)
);

const existingBookings = await getDocs(existingBookingQuery);

if (!existingBookings.empty) {
  // User already has a booking - handle seat change
}
```

### Move Booking (Delete + Create)

```javascript
// 1. Delete old booking
await deleteDoc(doc(db, 'participants', existingDoc.id));

// 2. Create new booking
await addDoc(collection(db, 'participants'), {
  event_id: selectedEvent,
  car_id: selectedSeat.carId,
  seat_number: selectedSeat.seatNumber,
  passenger_name: formData.passenger_name,
  passenger_email: formData.passenger_email,
  pickup_point: formData.pickup_point
});
```

**Why Delete + Create instead of Update?**
- Simpler logic (no special cases)
- Auto-generated IDs are fine
- Real-time listeners handle both operations
- No performance difference for this use case

## User Experience

### Scenario 1: First Booking

**User A** books Seat 1 with `alice@airasia.com`:
- ✅ Booking created
- ✅ Seat 1 shows occupied
- ✅ Message: "Seat booked successfully!"

### Scenario 2: Changing Seats

**User A** tries to book Seat 5 (same event, same email):
- ⚠️ System detects existing booking (Seat 1)
- 💬 Dialog: "You already have a booking (Driver X - Seat 1). Move to new seat?"
- ✅ If YES: Seat 1 becomes available, Seat 5 becomes occupied
- ❌ If NO: Nothing changes, modal closes

### Scenario 3: Multiple Events

**User A** books with `alice@airasia.com`:
- Event 1: Seat 3 ✅
- Event 2: Seat 7 ✅

**Result**: Two separate bookings (different events) - This is allowed!

### Scenario 4: Different Users, Same Email (Edge Case)

**User A** (Alice) books Seat 1 with `alice@airasia.com`
**User B** (also Alice) tries to book Seat 5 with `alice@airasia.com` from different device:

- ⚠️ System sees existing booking
- 💬 Prompts to move booking
- ✅ If YES: Only one booking exists (moved to Seat 5)

**This is the correct behavior!** Same email = Same person.

## Real-Time Behavior

### When Booking is Moved

**All connected users see:**

1. **Old seat** (Seat 1) → Changes from occupied to available ⚡
2. **New seat** (Seat 5) → Changes from available to occupied ⚡

**How?**
- Delete operation triggers real-time listener
- Create operation triggers real-time listener
- UI updates automatically for everyone

### Console Output

```
🔄 Real-time update: Participants refreshed  // Old seat freed
🔄 Real-time update: Participants refreshed  // New seat occupied
```

## Security Considerations

### Current Implementation

✅ **Good**:
- Email validation (HTML5)
- Firestore atomic operations
- Real-time consistency

⚠️ **Needs Improvement** (Production):
- No authentication (anyone can use any email)
- No email verification
- No rate limiting

### Production Recommendations

1. **Add Authentication**
```javascript
// Require users to sign in
const user = auth.currentUser;
if (!user) {
  alert('Please sign in first');
  return;
}
```

2. **Verify Email Ownership**
```javascript
// Use authenticated email only
passenger_email: user.email  // Can't be spoofed
```

3. **Server-Side Validation**
```javascript
// Cloud Function to enforce business rules
exports.validateBooking = functions.firestore
  .document('participants/{participantId}')
  .onCreate((snap, context) => {
    // Validate event_id exists
    // Validate car_id has available seats
    // Enforce one-booking-per-email rule
  });
```

## Firestore Security Rules

### Recommended Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /participants/{participantId} {
      // Anyone can read
      allow read: if true;
      
      // Only create with required fields
      allow create: if request.resource.data.keys().hasAll([
        'event_id', 'car_id', 'seat_number',
        'passenger_name', 'passenger_email', 'pickup_point'
      ]);
      
      // Only delete your own bookings (requires auth)
      allow delete: if request.auth != null
        && resource.data.passenger_email == request.auth.token.email;
      
      // No updates allowed (delete + create instead)
      allow update: if false;
    }
  }
}
```

## Performance

### Query Efficiency

**Check for existing booking:**
```
Query: WHERE event_id = X AND passenger_email = Y
Cost: 1 read
Index: Required (event_id + passenger_email)
```

**Create composite index:**
1. Go to Firestore Console
2. Navigate to Indexes tab
3. Create index:
   - Collection: `participants`
   - Fields: `event_id` (Ascending), `passenger_email` (Ascending)

Or click the link in the error message when first running the query.

### Read/Write Costs

**New booking:**
- 1 query (check existing)
- 1 write (create)
- **Total: 1 read + 1 write**

**Move booking:**
- 1 query (check existing)
- 1 delete + 1 create
- **Total: 1 read + 2 writes**

Still very cheap! Well within free tier limits.

## Edge Cases

### Case 1: Simultaneous Bookings (Race Condition)

**Scenario**: User A and User B both click the same seat at the exact same time.

**What happens:**
1. Both submit booking forms
2. Firestore processes in order (undefined which goes first)
3. First booking succeeds
4. Second booking also succeeds (overwrites seat)
5. Real-time listener updates everyone
6. Last write wins

**Solution** (if needed):
Use Firestore transactions to check seat availability before booking.

### Case 2: Moving While Someone Books Your Old Seat

**Scenario**:
1. User A has Seat 1
2. User A starts moving to Seat 5
3. User B books Seat 1 (now available)
4. User A completes move

**What happens:**
- User A's old booking deleted → Seat 1 available
- User B books Seat 1 → Success
- User A books Seat 5 → Success
- Final state: Both have bookings (different seats)

**This is correct!** No conflict.

### Case 3: Network Failure During Move

**Scenario**:
1. User A initiates move
2. Old booking deleted ✅
3. Network disconnects ❌
4. New booking fails

**What happens:**
- User has no booking (lost!)
- Error message shown
- User must book again

**Solution** (if needed):
Use Firestore transactions to make it atomic.

## Testing

### Test Case 1: Basic Booking

```
1. Open app
2. Select event
3. Click available seat
4. Fill form with: alice@test.com
5. Submit
Expected: Booking created, seat occupied
```

### Test Case 2: Move Booking

```
1. Book Seat 1 with alice@test.com
2. Click Seat 5
3. Enter SAME email: alice@test.com
4. Submit
Expected: Confirmation dialog appears
5. Click "OK"
Expected: Seat 1 available, Seat 5 occupied
```

### Test Case 3: Cancel Move

```
1. Book Seat 1 with alice@test.com
2. Click Seat 5
3. Enter SAME email: alice@test.com
4. Submit
Expected: Confirmation dialog
5. Click "Cancel"
Expected: Seat 1 still occupied, Seat 5 still available
```

### Test Case 4: Multiple Events

```
1. Book Event 1, Seat 1 with alice@test.com
2. Switch to Event 2
3. Book Seat 5 with alice@test.com
Expected: Two separate bookings (allowed!)
```

### Test Case 5: Real-Time Move

```
1. Open app in Chrome, book Seat 1
2. Open app in Firefox (same event)
3. In Chrome: Move booking to Seat 5
4. Watch Firefox: Seat 1 freed, Seat 5 occupied
Expected: Changes appear instantly in Firefox
```

## Future Enhancements

### 1. Booking History
Track all seat changes:
```javascript
{
  booking_id: "xyz",
  changes: [
    {timestamp: "...", from_seat: 1, to_seat: 5},
    {timestamp: "...", from_seat: 5, to_seat: 3}
  ]
}
```

### 2. Seat Preferences
Remember user's preferred pickup points:
```javascript
localStorage.setItem('preferred_pickup', 'RedQ Main Lobby');
```

### 3. Waitlist
When all seats full, add to waitlist:
```javascript
{
  status: "waitlisted",
  position: 3
}
```

### 4. Notifications
Email when seat becomes available or booking moved:
```javascript
// Cloud Function sends email
sendEmail(passenger_email, 'Booking Updated', ...);
```

## Summary

✅ **Implemented**: 
- One booking per email per event
- Automatic seat moving with confirmation
- Real-time updates for all users
- `event_id` in participants collection

✅ **Benefits**:
- No duplicate bookings
- Easy to change seats
- Clear user experience
- Efficient queries

✅ **Production-ready** with recommended security rules and authentication.

