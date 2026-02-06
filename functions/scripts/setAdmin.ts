import * as admin from "firebase-admin";
import * as path from "path";

admin.initializeApp({
  credential: admin.credential.cert(
    require(path.join(__dirname, "../serviceAccount.json"))
  )
});

const uid = "qP0FpcAhIpO2adWHXcI1oyafGnF3";

(async () => {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      admin: true
    });

    console.log("✅ Admin role assigned");
  } catch (err) {
    console.error("❌ Failed to set admin claim", err);
  } finally {
    process.exit(0);
  }
})();
