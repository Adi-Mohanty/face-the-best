import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// 🔥 CHANGE THIS TO YOUR REAL DEPLOY TIME
const DEPLOY_DATE = new Date("2026-02-19T21:02:00Z");

async function migrateQuestions() {
  console.log("Starting question migration...");

  const snapshot = await db
    .collection("questions")
    .where("createdAt", "<", DEPLOY_DATE)
    .get();

  if (snapshot.empty) {
    console.log("No old questions found.");
    return;
  }

  let batch = db.batch();
  let counter = 0;
  let totalUpdated = 0;

  for (const doc of snapshot.docs) {
    batch.update(doc.ref, {
      legacy: true,
      isActive: false,
      pipelineVersion: 1
    });

    counter++;
    totalUpdated++;

    // Firestore batch limit = 500
    if (counter === 500) {
      await batch.commit();
      console.log(`Updated ${totalUpdated} questions...`);
      batch = db.batch();
      counter = 0;
    }
  }

  if (counter > 0) {
    await batch.commit();
  }

  console.log(`Migration complete. Total updated: ${totalUpdated}`);
}

async function migrateGenerationJobs() {
  console.log("Starting generationJobs migration...");

  const snapshot = await db
    .collection("generationJobs")
    .where("createdAt", "<", DEPLOY_DATE)
    .get();

  if (snapshot.empty) {
    console.log("No old jobs found.");
    return;
  }

  let batch = db.batch();
  let counter = 0;
  let totalUpdated = 0;

  for (const doc of snapshot.docs) {
    batch.update(doc.ref, {
      legacy: true
    });

    counter++;
    totalUpdated++;

    if (counter === 500) {
      await batch.commit();
      console.log(`Updated ${totalUpdated} jobs...`);
      batch = db.batch();
      counter = 0;
    }
  }

  if (counter > 0) {
    await batch.commit();
  }

  console.log(`Job migration complete. Total updated: ${totalUpdated}`);
}

async function run() {
  try {
    await migrateQuestions();
    await migrateGenerationJobs();
    console.log("All migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
