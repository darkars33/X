import React from "react"
import {Routes, Route} from "react-router-dom"
import Home from "./pages/home/Home"
import LogIn from "./pages/auth/login/LogIn"
import SignUp from "./pages/auth/signup/SignUp"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import Notification from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"

function App() {
 

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/notifications' element={<Notification />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
