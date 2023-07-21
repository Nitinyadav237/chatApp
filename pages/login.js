import React, { useState, useEffect } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext.js";
import { toast } from "react-toastify";
import ToastMessage from "@/components/ToastMessage.jsx";
import Loader from "@/components/Loader.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";

const gprovider = new GoogleAuthProvider();

const Login = () => {
  const router = useRouter();
  const { currentUser, isLoading, setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    // Enable the submit button only if both email and password are valid and have input
    setCanSubmit(
      !emailInvalid &&
        !passwordInvalid &&
        email.length > 0 &&
        password.length > 0
    );
  }, [emailInvalid, passwordInvalid, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUserNotFound(false); // Reset the userNotFound state on successful login
    } catch (error) {
      console.error(error);
      setUserNotFound(true);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use signInWithPopup and await for the UserCredential object
      const result = await signInWithPopup(auth, gprovider);
      const user = result.user; // Access the user property from the UserCredential object

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user?.uid);
      const userDoc = await getDoc(userDocRef);

      // If the user doesn't exist, create a new user document in Firestore
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          photoURL: null,
          // Add other properties that you want to store in the user document
        });
      }

      // Set the currentUser state with the signed-in user
      setCurrentUser({
        uid: user?.uid,
        displayName: user?.displayName,
        email: user?.email,
        photoURL: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async () => {
    try {
      toast.promise(
        async () => {
          await sendPasswordResetEmail(auth, email);
        },
        {
          pending: "Generating reset Link",
          success: "Reset email sent to your registered email id",
          error: "You may have entered the wrong email id",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setShowPasswordHint(
      e.target.matches(":focus") && passwordValue.length === 0
    );
    setPassword(passwordValue);
    setPasswordInvalid(!passwordValue.length > 0);
  };

  const handlePasswordBlur = (e) => {
    setShowPasswordHint(false); // Remove the password hint when the input loses focus
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(emailValue);
    setEmailInvalid(!emailRegex.test(emailValue));
    setUserNotFound(false); // Reset the userNotFound state when the user starts typing a new email
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <>
      <div className="h-[100vh] flex justify-center items-center bg-c1">
        <ToastMessage />
        <div className="flex items-center flex-col">
          <div className="text-center">
            <div className="text-4xl font-bold">Login To Your Account</div>
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
            className="flex flex-col items-center gap-3 w-[500px] mt-5"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              className={`w-full h-14 bg-c5 rounded-xl outline-none px-5 text-c3 ${
                emailInvalid ? "border-red-500" : ""
              }`}
              autoComplete="off"
              onChange={handleEmailChange}
              value={email}
            />
            {emailInvalid && (
              <div className="text-red-500 text-sm mt-2">
                Please enter a valid email address.
              </div>
            )}
            <input
              type="password"
              placeholder="Password"
              className={`w-full h-14 bg-c5 rounded-xl outline-none px-5 text-c3 ${
                passwordInvalid ? "border-red-500" : ""
              }`}
              autoComplete="off"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur} // Add onBlur event handler
              value={password}
            />
            {showPasswordHint && (
              <div className="text-red-500 text-sm mt-2">
                Please fill the password field.
              </div>
            )}
            {userNotFound && (
              <div className="text-red-500 text-sm mt-2">
                User not found. Please check the email and password.
              </div>
            )}
            <div className="text-right w-full text-c3">
              <span className="cursor-pointer" onClick={resetPassword}>
                Forgot Password?
              </span>
            </div>
            <button
              className={`mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold ${
                canSubmit
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
                  : "bg-c5 cursor-not-allowed"
              }`}
              disabled={!canSubmit}
            >
              Login to Your Account
            </button>
          </form>

          <div className="flex justify-center gap-1 text-c3 mt-5 ">
            <span>Not a member yet?</span>
            <Link
              href="/register"
              className="font-semibold text-white underline underline-offset-2 cursor-pointer"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
