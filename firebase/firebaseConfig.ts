import { firebaseConfig } from "@/next-env";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// export const firebaseConfig = {
//   apiKey: "AIzaSyAgNjfCezh-bjxEg4rkKoyqsJrKrh0kSvQ",
//   authDomain: "quick-load-a8aa6.firebaseapp.com",
//   projectId: "quick-load-a8aa6",
//   storageBucket: "quick-load-a8aa6.appspot.com",
//   messagingSenderId: "179715165099",
//   appId: "1:179715165099:web:eb1db7a54c5befbaa260ee",
//   measurementId: "G-YKK90JZZCS",
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

export const initializeRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {},
  });
};

// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyC4STJesm6rGV-N_7lvCIluoSRppKmmtzk",
//   authDomain: "moving-rolls-707e9.firebaseapp.com",
//   projectId: "moving-rolls-707e9",
//   storageBucket: "moving-rolls-707e9.appspot.com",
//   messagingSenderId: "350925667583",
//   appId: "1:350925667583:web:ba9e8dc9e9222e03a9a0ca",
//   measurementId: "G-NYD9J9ZTX9",
// };

// // Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// auth.useDeviceLanguage();

// export { auth };
