import React, { useState, useEffect } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import Link from "next/link";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext.js";
import { profileColors } from "@/utills/constants.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loader from "@/components/Loader";

const gprovider = new GoogleAuthProvider();

const Register = () => {
  const router = useRouter();
  const { currentUser, isLoading, setCurrentUser } = useAuth();
  const [disabled, setDisabled] = useState(true);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showDisplayNameWarning, setShowDisplayNameWarning] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading]);

  const signInWithGoogle = async () => {
    try {
      // Use signInWithPopup and await for the UserCredential object
      const result = await signInWithPopup(auth, gprovider);
      const user = result.user; // Access the user property from the UserCredential object

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If the user doesn't exist, create a new user document in Firestore
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          // Add other properties that you want to store in the user document
        });
      }

      // Set the currentUser state with the signed-in user
      setCurrentUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    // Check if display name has at least 3 characters
    if (displayName.length < 3) {
      setShowDisplayNameWarning(true);
      setDisabled(true);
      return;
    } else {
      setShowDisplayNameWarning(false);
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShowEmailWarning(true);
      setDisabled(true);
      return;
    } else {
      setShowEmailWarning(false);
    }

    // Check if password is at least 6 characters long
    if (password.length < 6) {
      setShowPasswordHint(true);
      setDisabled(true);
      return;
    } else {
      setShowPasswordHint(false);
    }

    // If all fields are filled, enable the "Sign up" button
    setDisabled(false);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
      });
      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, {
        displayName,
      });

      console.log(user);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const displayName = e.target.form.displayName.value;
    const email = e.target.form.email.value;
    const password = e.target.form.password.value;

    setDisabled(!displayName || !email || password.length < 6);
    setShowDisplayNameWarning(value.length <= 2);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const displayName = e.target.form.displayName.value;
    const password = e.target.form.password.value;

    setDisabled(!displayName || !email || password.length < 6);
    setShowEmailWarning(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handlesignup = (e) => {
    const password = e.target.value;
    const displayName = e.target.form.displayName.value;
    const email = e.target.form.email.value;

    setDisabled(!displayName || !email || password.length < 6);
    setShowPasswordHint(password.length < 6);
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <>
      <div className="h-[100vh] flex justify-center items-center bg-c1">
        <div className="flex items-center flex-col">
          <div className="text-center">
            <div className="text-4xl font-bold">Create New Account</div>
            <div className="mt-3 text-c3">
              Connect and Chat with Anyone, Anywhere
            </div>
          </div>

          <div className="flex items-center gap-2 w-full mt-10 mb-5">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
              onClick={signInWithGoogle}
            >
              <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
                <IoLogoGoogle size={24} />
                <span>Login with Google</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
              <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
                <IoLogoFacebook size={24} />
                <span>Login with Facebook</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="w-5 h-[1px] bg-c3"></span>
            <span className="text-c3 font-semibold">OR</span>
            <span className="w-5 h-[1px] bg-c3"></span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-3 w-[500px] mt-5"
          >
            <input
              type="text"
              name="displayName"
              placeholder="Display Name"
              className={`w-full h-14 bg-c5 rounded-xl outline-none px-5 text-c3 ${
                showDisplayNameWarning ? "border-red-500" : ""
              }`}
              autoComplete="off"
              required
              onChange={handleInputChange}
            />
            {showDisplayNameWarning && (
              <span className="text-red-500 text-sm mt-2">
                Please fill the Display Name field (at least 3 characters).
              </span>
            )}

            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              className={`w-full h-14 bg-c5 rounded-xl outline-none px-5 text-c3 ${
                showEmailWarning ? "border-red-500" : ""
              }`}
              autoComplete="off"
              required
              onChange={handleEmailChange}
            />
            {showEmailWarning && (
              <span className="text-red-500 text-sm mt-2">
                Please enter a valid email address.
              </span>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full h-14 bg-c5 rounded-xl outline-none px-5 text-c3 ${
                showPasswordHint ? "border-red-500" : ""
              }`}
              autoComplete="off"
              onChange={handlesignup}
              required
            />
            {showPasswordHint && (
              <span className="text-red-500 text-sm mt-2">
                Password should be at least 6 characters long.
              </span>
            )}

            <button
              type="submit"
              className={`mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={disabled}
            >
              Sign up
            </button>
          </form>

          <div className="flex justify-center gap-1 text-c3 mt-5 ">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="font-semibold text-white underline underline-offset-2 cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
