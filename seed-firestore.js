/**
 * Firestore Seeding Script (Robust Version)
 * 
 * This script automatically seeds Firestore with data from JSON files in the dummy-data folder.
 * Files should be named with Unix epoch time prefix for proper sequencing:
 * 
 * Examples:
 *   1000_events.json      -> seeds 'events' collection
 *   2000_cars.json        -> seeds 'cars' collection
 *   3000_participants.json -> seeds 'participants' collection
 * 
 * The script will:
 * - Auto-detect all JSON files with numeric prefix
 * - Process them in sequential order (sorted by prefix)
 * - Use custom document IDs if 'id' field exists in data
 * - Auto-generate IDs otherwise
 * 
 * Usage:
 *   node seed-firestore.js
 * 
 * Options:
 *   --clear    Clear existing data before seeding
 * 
 * Example:
 *   node seed-firestore.js --clear
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Check if service account key exists
const serviceAccountPath = path.join(__dirname, 'SA.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: SA.json not found!');
  console.error('');
  console.error('Please follow these steps:');
  console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.error('2. Select your project: carpool-system-12321321');
  console.error('3. Go to Project Settings > Service Accounts');
  console.error('4. Click "Generate New Private Key"');
  console.error('5. Save the file as "SA.json" in the project root');
  console.error('');
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require('./SA.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Check for --clear flag
const shouldClear = process.argv.includes('--clear');

/**
 * Get all seeding files from dummy-data folder
 * Files must follow pattern: {number}_{collection}.json
 */
function getSeedingFiles() {
  const dummyDataPath = path.join(__dirname, 'dummy-data');
  
  if (!fs.existsSync(dummyDataPath)) {
    console.error('❌ Error: dummy-data folder not found!');
    process.exit(1);
  }

  const files = fs.readdirSync(dummyDataPath);
  
  // Filter and parse files with pattern: {number}_{name}.json
  const seedFiles = files
    .filter(file => {
      const match = file.match(/^(\d+)_(.+)\.json$/);
      return match !== null;
    })
    .map(file => {
      const match = file.match(/^(\d+)_(.+)\.json$/);
      return {
        filename: file,
        order: parseInt(match[1]),
        collection: match[2],
        path: path.join(dummyDataPath, file)
      };
    })
    .sort((a, b) => a.order - b.order);

  return seedFiles;
}

/**
 * Clear a Firestore collection
 */
async function clearCollection(collectionName) {
  console.log(`🗑️  Clearing ${collectionName} collection...`);
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`   No documents to delete in ${collectionName}`);
    return;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`   ✅ Deleted ${snapshot.size} documents from ${collectionName}`);
}

/**
 * Seed a collection with data from JSON file
 */
async function seedCollection(collectionName, data) {
  console.log(`🌱 Seeding ${collectionName} collection...`);
  
  if (!Array.isArray(data)) {
    console.error(`   ❌ Error: Data must be an array in ${collectionName}.json`);
    return { success: 0, errors: 1 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const item of data) {
    try {
      // Check if item has an 'id' field for custom document ID
      if (item.id) {
        const { id, ...dataWithoutId } = item;
        await db.collection(collectionName).doc(id).set({
          ...dataWithoutId,
          created_at: new Date()
        });
        successCount++;
        console.log(`   ✅ Added to ${collectionName}: ID=${id}`);
      } else {
        // Auto-generate ID
        const docRef = await db.collection(collectionName).add({
          ...item,
          created_at: new Date()
        });
        successCount++;
        console.log(`   ✅ Added to ${collectionName}: ID=${docRef.id}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error adding to ${collectionName}:`, error.message);
    }
  }

  console.log(`   Success: ${successCount}, Errors: ${errorCount}`);
  console.log('');
  
  return { success: successCount, errors: errorCount };
}

/**
 * Main seeding function
 */
async function main() {
  console.log('');
  console.log('🚀 Firestore Seeding Script (Robust Mode)');
  console.log('==========================================');
  console.log('');

  try {
    // Get all seeding files
    const seedFiles = getSeedingFiles();

    if (seedFiles.length === 0) {
      console.log('⚠️  No seeding files found!');
      console.log('');
      console.log('Files in dummy-data folder should follow pattern: {number}_{collection}.json');
      console.log('Examples:');
      console.log('  - 1000_events.json');
      console.log('  - 2000_cars.json');
      console.log('  - 3000_participants.json');
      console.log('');
      process.exit(1);
    }

    console.log('📂 Found seeding files:');
    seedFiles.forEach(file => {
      console.log(`   ${file.order} → ${file.collection} (${file.filename})`);
    });
    console.log('');

    // Clear collections if requested
    if (shouldClear) {
      console.log('🗑️  Clearing mode enabled...');
      for (const file of seedFiles) {
        await clearCollection(file.collection);
      }
      console.log('');
    }

    // Seed each collection in order
    const stats = {
      totalCollections: 0,
      totalDocuments: 0,
      totalErrors: 0
    };

    for (const file of seedFiles) {
      const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
      const result = await seedCollection(file.collection, data);
      
      stats.totalCollections++;
      stats.totalDocuments += result.success;
      stats.totalErrors += result.errors;
    }

    // Print summary
    console.log('📊 Summary:');
    console.log(`   Collections seeded: ${stats.totalCollections}`);
    console.log(`   Total documents: ${stats.totalDocuments}`);
    console.log(`   Total errors: ${stats.totalErrors}`);
    console.log('');

    if (stats.totalErrors === 0) {
      console.log('✅ All done! You can now run your React app.');
    } else {
      console.log('⚠️  Completed with some errors. Check logs above.');
    }
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error during seeding:', error);
    console.error('');
    process.exit(1);
  }
}

main();
