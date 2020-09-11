import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React, { useState, useEffect } from "react";
import DefaultUserImage from "./images/default-user-image.jpg";
import { CREATE_USER } from "./graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyD9sXDJ4FdiBL0sIviEwnIN8kCkrGCgkkk",
  authDomain: "insta-7323f.firebaseapp.com",
  databaseURL: "https://insta-7323f.firebaseio.com",
  projectId: "insta-7323f",
  storageBucket: "insta-7323f.appspot.com",
  messagingSenderId: "816760685696",
  appId: "1:816760685696:web:0279900c01b0f749cc5265",
  measurementId: "G-03FVJV8RR5",
});

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");

          metadataRef.on("value", async (data) => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  async function loginWithGoogle() {
    const data = await firebase.auth().signInWithPopup(provider);

    if (data.additionalUserInfo.isNewUser) {
      const { name, email, picture } = data.additionalUserInfo.profile;
      const variables = {
        userId: data.user.uid,
        name: name,
        username: name.replace(/\s+/g, ""),
        email: email,
        website: "",
        bio: "",
        phoneNumber: "",
        profileImage: picture,
      };

      await createUser({ variables });
    }
  }

  async function signUpWithEmailAndPassword(formData) {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password);
    if (data.additionalUserInfo.isNewUser) {
      console.log(data);
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        website: "",
        bio: "",
        phoneNumber: "",
        profileImage: DefaultUserImage,
      };
      console.log(variables);
      await createUser({ variables });
    }
  }

  async function signInWithEmailAndPassword(email, password) {
    const res = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.log(res);
  }

  async function signOut() {
    setAuthState({ status: "loading" });
    await firebase.auth().signOut();
    setAuthState({ status: "out" });
  }

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          loginWithGoogle,
          signOut,
          signUpWithEmailAndPassword,
          signInWithEmailAndPassword,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
