"use client";

import React, { use } from "react";

import { useContext, useState, useEffect } from "react";
import { AppContext, AppState } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";

import { auth, db } from "../firebase/config";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";

import HeaderNav from "./HeaderNav";

const Profile = () => {
  const { user } = useAuthContext();

  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    fullName: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
  });

  const { fullName, email } = formData;

  const { theme } = useContext(AppContext) as AppState;

  const router = useRouter();

  useEffect(() => {
    if (user == null) {
      console.log("user is null");
      router.push("/signin");
    }
  }, [user, router]);

  const onProfileDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onLogout = () => {
    auth.signOut();

    router.push("/signin");
    console.log("successfully logged out");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser && auth.currentUser?.displayName !== fullName) {
        await updateProfile(auth.currentUser, {
          displayName: fullName,
        });

        const userRef = doc(db, "users", auth.currentUser?.uid);

        await updateDoc(userRef, {
          fullName,
        });
      }
    } catch (error) {
      console.log(error);
    }

    console.log("successfully updated profile");
  };

  if (user == null) {
    return null;
  }

  return (
    <>
      <HeaderNav />

      <section className="grid grid-rows-2 items-center mx-auto relative top-[1rem] w-[327px] xl:w-[540px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">My Profile</h2>

          <button
            type="button"
            className=" text-veryLightGrayishBlue bg-brightBlue hover:scale-95 font-normal rounded-lg text-lg px-5 py-2.5 text-center"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <div className="profile-details flex flex-col">
          <button
            className="text-veryLightGrayishBlue bg-veryDarkGrayishBlueA text-lg font-normal hover:scale-95 rounded-lg px-5 py-2.5 text-center w-[11rem]"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "Submit Changes" : "Edit Profile"}
          </button>

          <div className="profileCard mt-3">
            <form>
              <input
                type="text"
                id="fullName"
                className={`w-full px-4 min-h-[53px] xl:min-h-[64px] drop-shadow-lg rounded-[5px] text-[20px] ${
                  theme === "light"
                    ? "bg-veryLightGray text-darkerGrayishBlueB"
                    : "bg-veryDarkDesaturatedBlue text-veryLightGray"
                }`}
                disabled={!changeDetails}
                value={fullName}
                onChange={onProfileDetailsChange}
              />

              <input
                type="text"
                id="email"
                className={`w-full px-4 min-h-[53px] xl:min-h-[64px] drop-shadow-lg rounded-[5px] text-[20px] mt-3 ${
                  theme === "light"
                    ? "bg-veryLightGray text-darkerGrayishBlueB"
                    : "bg-veryDarkDesaturatedBlue text-veryLightGray"
                }`}
                disabled={true}
                value={email}
                onChange={onProfileDetailsChange}
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;