
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

export const useAnalytics = ()=>{
  const firebaseConfig = {
    apiKey: "AIzaSyC6NiV9vAHCYGTcVA9qGvHglMWpUKOkNw8",
    authDomain: "mises-discover.firebaseapp.com",
    projectId: "mises-discover",
    storageBucket: "mises-discover.appspot.com",
    messagingSenderId: "828397319030",
    appId: "1:828397319030:web:74d05c6f8a57c6cdb80057",
    measurementId: "G-BK82MPK1E9"
  };
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  return analytics
}