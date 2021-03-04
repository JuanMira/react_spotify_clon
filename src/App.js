import React, { useState } from 'react';
import firebase from './utils/Firebase'
import { ToastContainer } from 'react-toastify'
import "firebase/auth";
import LoggedLayout from './layouts/loggedLayout'

//components
import Auth from './pages/auth'

function App() {

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadApp, setReloadApp] = useState(false)

  firebase.auth().onAuthStateChanged(currentUser => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null)
    } else {
      setUser(currentUser)
    }
    setLoading(false)
    //if (!currentUser) setUser(null)
    //else setUser(currentUser)
    //setLoading(false)

  });

  if (loading) return null

  //return (
  //  !user ? <Auth /> : <UserLoged></UserLoged>
  //);
  return (
    <>
      {!user ? <Auth /> : <LoggedLayout user={user} setReloadApp={setReloadApp} />}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={false}
      />
    </>
  )
}

export default App;

