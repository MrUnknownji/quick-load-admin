import { firebaseConfig } from "@/next-env";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

export const initializeRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {},
  });
};
