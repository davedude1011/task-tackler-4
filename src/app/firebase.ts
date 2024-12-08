import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

// Function to delete old messages if over a threshold
export const cleanUpMessages = (threshold = 100) => {
  const messagesRef = ref(database, "messages");
  onValue(messagesRef, (snapshot) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = snapshot.val();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const messageCount = data ? Object.keys(data).length : 0;

    if (messageCount > threshold) {
      setTimeout(() => {
        // Remove the messages after 30 seconds
        console.log("Cleaning up old messages from Firebase...");
        remove(messagesRef)
          .then(() => {
            console.log("Old messages deleted.");
          })
          .catch((error) => {
            console.error("Error deleting messages:", error);
          });
      }, 30000); // 30 seconds delay
    }
  });
};
