import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/home/Home"
import LogIn from "./pages/auth/login/LogIn"
import SignUp from "./pages/auth/signup/SignUp"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import Notification from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import {Toaster} from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner"

function App() {
  
  const {data:authUser, isLoading} =  useQuery({
    queryKey: ['authUser'],
    queryFn: async () =>{
      try {
        const res= await fetch('/api/auth/me');
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error);
        }
        console.log(data);
        return data;
      } catch (error) {
          throw new Error('An error occurred while fetching user data');
      }
    }
  })

  // if(isLoading){
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <LoadingSpinner size='lg' />
  //     </div>
  //   )
  // }

  // const hh= false;

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LogIn /> : <Navigate to='/'/> } />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to='/' /> } />
        <Route path='/notifications' element={authUser ? <Notification /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser? <ProfilePage />: <Navigate to='/login' />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
